import { Routes } from '@angular/router';
import { KitsuneListe } from './kitsunes/kitsune-liste/kitsune-liste';
import { KitsuneDetail } from './kitsunes/kitsune-detail/kitsune-detail';
import { KitsuneAjout } from './kitsunes/kitsune-ajout/kitsune-ajout';
import { Bataille } from './bataille/bataille';

export const routes: Routes = [
  { path: '', redirectTo: '/kitsunes', pathMatch: 'full' },
  { path: 'kitsunes', component: KitsuneListe },
  // Le nom étant unique, il sert d'identifiant dans l'URL
  { path: 'kitsunes/:nom', component: KitsuneDetail },
  { path: 'ajout', component: KitsuneAjout },
  { path: 'bataille', component: Bataille },
  { path: '**', redirectTo: '/kitsunes' },
];
