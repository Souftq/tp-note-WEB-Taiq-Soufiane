import { Routes } from '@angular/router';
import { KitsuneListe } from './kitsunes/kitsune-liste/kitsune-liste';

export const routes: Routes = [
  { path: '', redirectTo: '/kitsunes', pathMatch: 'full' },
  { path: 'kitsunes', component: KitsuneListe },
  { path: '**', redirectTo: '/kitsunes' },
];
