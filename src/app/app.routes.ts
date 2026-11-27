import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { KitsuneListe } from './kitsunes/kitsune-liste/kitsune-liste';
import { KitsuneDetail } from './kitsunes/kitsune-detail/kitsune-detail';
import { KitsuneAjout } from './kitsunes/kitsune-ajout/kitsune-ajout';
import { Bataille } from './bataille/bataille';

export const routes: Routes = [
  { path: '', redirectTo: '/accueil', pathMatch: 'full' },
  { path: 'accueil', component: Accueil },
  { path: 'kitsunes', component: KitsuneListe },
  // Le nom est unique, on s'en sert dans l'URL
  { path: 'kitsunes/:nom', component: KitsuneDetail },
  { path: 'ajout', component: KitsuneAjout },
  { path: 'bataille', component: Bataille },
  { path: '**', redirectTo: '/accueil' },
];
