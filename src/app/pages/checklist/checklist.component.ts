import { Component } from '@angular/core';
import checklistData from './checklist.data.json';
import { resolveCardImage, type CardImageOverride } from '../../utils/card-images';

interface ChecklistItem {
  label: string;
  checked: boolean;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

interface ChecklistCard {
  chip: string;
  title: string;
  description?: string;
  image?: CardImageOverride;
  sections: ChecklistSection[];
}

interface ChecklistData {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cards: ChecklistCard[];
}

@Component({
  selector: 'app-checklist',
  standalone: true,
  templateUrl: './checklist.component.html'
})
export class ChecklistComponent {
  protected readonly data = checklistData as ChecklistData;
  private readonly defaultImagePosition = 'center 65%';

  protected cardImageSrc(card: ChecklistCard): string {
    return resolveCardImage(`${card.title} ${card.chip}`, card.image).src;
  }

  protected cardImageAlt(card: ChecklistCard): string {
    return resolveCardImage(`${card.title} ${card.chip}`, card.image).alt;
  }

  protected cardImagePosition(card: ChecklistCard): string {
    return card.image?.position ?? this.defaultImagePosition;
  }
}
