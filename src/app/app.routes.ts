import { Routes } from '@angular/router';
import { KitsuneListe } from './kitsunes/kitsune-liste/kitsune-liste';
import { KitsuneDetail } from './kitsunes/kitsune-detail/kitsune-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/kitsunes', pathMatch: 'full' },
  { path: 'kitsunes', component: KitsuneListe },
  // Le nom étant unique, il sert d'identifiant dans l'URL
  { path: 'kitsunes/:nom', component: KitsuneDetail },
  { path: '**', redirectTo: '/kitsunes' },
];
