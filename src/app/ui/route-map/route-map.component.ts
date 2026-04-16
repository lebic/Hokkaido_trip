import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  inject,
  NgZone,
  signal,
  computed,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RouteWaypoint {
  name: string;
  lat: number;
  lng: number;
  isStop?: boolean;
}

export type TransportMode = 'driving' | 'ferry' | 'flight' | 'train';

interface LegInfo {
  from: string;
  to: string;
  durationMin: number; // -1 = unknown
  overThreshold: boolean;
}

interface OsrmResponse {
  routes: Array<{
    legs: Array<{ duration: number; distance: number }>;
    geometry: { type: string; coordinates: [number, number][] };
  }>;
}

@Component({
  selector: 'app-route-map',
  standalone: true,
  templateUrl: './route-map.component.html',
})
export class RouteMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() waypoints: RouteWaypoint[] = [];
  @Input() mode: TransportMode = 'driving';

  @ViewChild('mapEl') mapElRef!: ElementRef<HTMLDivElement>;

  private http = inject(HttpClient);
  private zone = inject(NgZone);

  protected readonly loading = signal(true);
  protected readonly legs = signal<LegInfo[]>([]);
  protected readonly hasLongLeg = computed(() => this.legs().some(l => l.overThreshold));
  protected readonly routeError = signal<string | null>(null);

  private map: import('leaflet').Map | null = null;
  private routeLayer: import('leaflet').LayerGroup | null = null;
  private mapReady = false;

  ngAfterViewInit(): void {
    this.mapReady = true;
    if (this.waypoints.length >= 2) {
      void this.initMap();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['waypoints'] && !changes['waypoints'].firstChange && this.mapReady) {
      void this.resetAndDraw();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  protected formatDuration(minutes: number): string {
    if (minutes < 0) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
  }

  private async initMap(): Promise<void> {
    const L = await import('leaflet');

    this.zone.runOutsideAngular(() => {
      this.map = L.map(this.mapElRef.nativeElement, {
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(this.map);

      this.routeLayer = L.layerGroup().addTo(this.map);
    });

    await this.drawRoute();
  }

  private async resetAndDraw(): Promise<void> {
    this.zone.run(() => {
      this.loading.set(true);
      this.legs.set([]);
      this.routeError.set(null);
    });

    if (this.routeLayer) {
      this.routeLayer.clearLayers();
    }

    if (this.waypoints.length >= 2) {
      await this.drawRoute();
    } else {
      this.zone.run(() => this.loading.set(false));
    }
  }

  private async drawRoute(): Promise<void> {
    if (!this.map || !this.routeLayer || this.waypoints.length < 2) return;

    const L = await import('leaflet');

    this.zone.runOutsideAngular(() => {
      this.addMarkers(L);
    });

    if (this.mode === 'ferry' || this.mode === 'flight') {
      this.zone.runOutsideAngular(() => {
        const latlngs = this.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]);
        L.polyline(latlngs, {
          color: this.mode === 'flight' ? '#8b5cf6' : '#0ea5e9',
          weight: 3,
          dashArray: '10 8',
          opacity: 0.8,
        }).addTo(this.routeLayer!);
        this.fitBounds(L);
      });
      this.zone.run(() => {
        this.legs.set([
          {
            from: this.waypoints[0].name,
            to: this.waypoints[this.waypoints.length - 1].name,
            durationMin: -1,
            overThreshold: false,
          },
        ]);
        this.loading.set(false);
      });
      return;
    }

    if (this.mode === 'train') {
      this.zone.runOutsideAngular(() => {
        const latlngs = this.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]);
        L.polyline(latlngs, {
          color: '#f97316',
          weight: 3,
          dashArray: '4 6',
          opacity: 0.9,
        }).addTo(this.routeLayer!);
        this.fitBounds(L);
      });
      this.zone.run(() => {
        this.legs.set([
          {
            from: this.waypoints[0].name,
            to: this.waypoints[this.waypoints.length - 1].name,
            durationMin: -1,
            overThreshold: false,
          },
        ]);
        this.loading.set(false);
      });
      return;
    }

    // Driving: fetch OSRM route
    try {
      const coordStr = this.waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;

      const result = await firstValueFrom(this.http.get<OsrmResponse>(url));

      if (!result?.routes?.length) throw new Error('No route');

      const route = result.routes[0];

      this.zone.runOutsideAngular(() => {
        const latlngs = route.geometry.coordinates.map(
          ([lng, lat]) => [lat, lng] as [number, number],
        );
        L.polyline(latlngs, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.85,
        }).addTo(this.routeLayer!);
        this.fitBounds(L);
      });

      const legInfos: LegInfo[] = route.legs.map((leg, i) => ({
        from: this.waypoints[i].name,
        to: this.waypoints[i + 1].name,
        durationMin: Math.round(leg.duration / 60),
        overThreshold: leg.duration > 3 * 3600,
      }));

      this.zone.run(() => {
        this.legs.set(legInfos);
        this.loading.set(false);
      });
    } catch {
      // Fallback: dashed straight line
      this.zone.runOutsideAngular(() => {
        const latlngs = this.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]);
        L.polyline(latlngs, { color: '#3b82f6', weight: 3, dashArray: '6 6' }).addTo(
          this.routeLayer!,
        );
        this.fitBounds(L);
      });
      this.zone.run(() => {
        this.routeError.set('Itinéraire routier indisponible');
        this.loading.set(false);
      });
    }
  }

  private addMarkers(L: typeof import('leaflet')): void {
    const total = this.waypoints.length;
    this.waypoints.forEach((wp, i) => {
      const isFirst = i === 0;
      const isLast = i === total - 1;
      const isStop = wp.isStop;

      const bg = isFirst ? '#22c55e' : isLast ? '#ef4444' : isStop ? '#f59e0b' : '#6366f1';
      const label = isFirst ? 'D' : isLast ? 'A' : isStop ? '⏸' : '●';

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:28px;height:28px;
          background:${bg};
          border:2.5px solid white;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:10px;font-weight:700;color:white;
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
          cursor:default;
        ">${label}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });

      L.marker([wp.lat, wp.lng], { icon })
        .bindPopup(
          `<strong style="font-size:13px">${wp.name}</strong>${isStop ? '<br><span style="font-size:11px;color:#92400e">Arrêt suggéré</span>' : ''}`,
        )
        .addTo(this.routeLayer!);
    });
  }

  private fitBounds(L: typeof import('leaflet')): void {
    if (!this.map || !this.routeLayer) return;
    try {
      const layers = this.routeLayer.getLayers();
      if (layers.length) {
        const group = L.featureGroup(layers);
        this.map.fitBounds(group.getBounds().pad(0.25));
      }
    } catch {
      // ignore
    }
  }
}
