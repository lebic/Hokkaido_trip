import { Component } from '@angular/core';
import checklistData from './checklist.data.json';
import { imageForText } from '../../utils/card-images';

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

  protected cardImageSrc(card: ChecklistCard): string {
    return imageForText(`${card.title} ${card.chip}`).src;
  }

  protected cardImageAlt(card: ChecklistCard): string {
    return imageForText(`${card.title} ${card.chip}`).alt;
  }
}
