import { Component, signal, computed } from '@angular/core';
import { ChipComponent } from '../../ui/chip/chip.component';
import itineraireData from './itineraire.data.json';
import { resolveCardImage, type CardImageOverride } from '../../utils/card-images';

type CardTone = 'forest' | 'clay' | 'berry';
type SectionType = 'hebergement' | 'transport' | 'activite' | 'other';

interface PageSection {
  title: string;
  items: string[];
}

interface PageCard {
  chip: string;
  tone: CardTone;
  title: string;
  location?: string;
  description?: string;
  image?: CardImageOverride;
  sections: PageSection[];
}

interface PageData {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cards: PageCard[];
}

@Component({
  selector: 'app-itineraire',
  standalone: true,
  imports: [ChipComponent],
  templateUrl: './itineraire.component.html',
})
export class ItineraireComponent {
  protected readonly data = itineraireData as PageData;
  private readonly defaultImagePosition = 'center 65%';

  protected readonly selectedIndex = signal<number | null>(null);

  protected readonly selectedCard = computed(() => {
    const i = this.selectedIndex();
    return i !== null ? this.data.cards[i] : null;
  });

  protected readonly prevCard = computed(() => {
    const i = this.selectedIndex();
    if (i === null || i === 0) return null;
    return { card: this.data.cards[i - 1], index: i - 1 };
  });

  protected readonly nextCard = computed(() => {
    const i = this.selectedIndex();
    if (i === null || i >= this.data.cards.length - 1) return null;
    return { card: this.data.cards[i + 1], index: i + 1 };
  });

  protected selectCard(index: number): void {
    this.selectedIndex.set(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected closeDetail(): void {
    this.selectedIndex.set(null);
  }

  protected navigate(index: number): void {
    this.selectedIndex.set(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected sectionType(title: string): SectionType {
    const t = title.toLowerCase();
    if (t.includes('hebergement')) return 'hebergement';
    if (t.includes('transport') || t.includes('en route') || t.includes('arrets')) return 'transport';
    if (t.includes('activite') || t.includes('au choix') || t.includes('a bord')) return 'activite';
    return 'other';
  }

  private isHebergementSection(title: string): boolean {
    return this.sectionType(title) === 'hebergement';
  }

  private isTransportSection(title: string): boolean {
    return this.sectionType(title) === 'transport';
  }

  protected hebergementItem(card: PageCard): string {
    const s = card.sections.find(s => this.isHebergementSection(s.title));
    return s?.items[0] ?? '';
  }

  protected transportSections(card: PageCard): PageSection[] {
    return card.sections.filter(s => this.isTransportSection(s.title));
  }

  protected programmeSections(card: PageCard): PageSection[] {
    return card.sections.filter(
      s => !this.isHebergementSection(s.title) && !this.isTransportSection(s.title)
    );
  }

  protected cardImageSrc(card: PageCard): string {
    return resolveCardImage(`${card.title} ${card.chip}`, card.image).src;
  }

  protected cardImageAlt(card: PageCard): string {
    return resolveCardImage(`${card.title} ${card.chip}`, card.image).alt;
  }

  protected cardImagePosition(card: PageCard): string {
    return card.image?.position ?? this.defaultImagePosition;
  }
}

