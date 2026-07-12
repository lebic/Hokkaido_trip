import { Routes } from '@angular/router';
import { JourneyComponent } from './features/journey/journey.component';
import { StageComponent } from './features/stage/stage.component';
import { PreparatifsComponent } from './features/preparatifs/preparatifs.component';
import { TravelsComponent } from './pages/travels/travels.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'voyages' },
	{ path: 'voyages', component: TravelsComponent, title: 'Travelbook — Voyages' },
	{ path: 'itineraire', component: JourneyComponent, title: 'Itinéraire' },
	{ path: 'stage/:index', component: StageComponent, title: 'Étape' },
	{ path: 'preparatifs', component: PreparatifsComponent, title: 'Préparatifs' },

	// Anciennes pages type-silo : fusionnées dans Préparatifs (liens/bookmarks préservés)
	{ path: 'hebergements', pathMatch: 'full', redirectTo: 'preparatifs' },
	{ path: 'transports', pathMatch: 'full', redirectTo: 'preparatifs' },
	{ path: 'activites', pathMatch: 'full', redirectTo: 'preparatifs' },
	{ path: 'reservations', pathMatch: 'full', redirectTo: 'preparatifs' },

	{ path: '**', redirectTo: 'voyages' },
];
