import { Routes } from '@angular/router';
import { ItineraireComponent } from './pages/itineraire/itineraire.component';
import { HebergementsComponent } from './pages/hebergements/hebergements.component';
import { TransportsComponent } from './pages/transports/transports.component';
import { ActivitesComponent } from './pages/activites/activites.component';
import { ChecklistComponent } from './pages/checklist/checklist.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'itineraire' },
	{ path: 'itineraire', component: ItineraireComponent, title: 'Itineraire' },
	{ path: 'hebergements', component: HebergementsComponent, title: 'Hebergements' },
	{ path: 'transports', component: TransportsComponent, title: 'Transports' },
	{ path: 'activites', component: ActivitesComponent, title: 'Activites' },
	{ path: 'checklist', component: ChecklistComponent, title: 'Checklist' },
	{ path: 'reservations', component: ReservationsComponent, title: 'Reservations' }
];
