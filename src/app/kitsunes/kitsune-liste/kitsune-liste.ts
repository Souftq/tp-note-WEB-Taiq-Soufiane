import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionKitsunes } from '../gestion-kitsunes';

// Illustrations des Kitsune de départ (ceux créés avec le formulaire n'en ont pas)
const IMAGES: Record<string, string> = {
  'Tamamo-no-Mae': 'kitsunes/tamamo-no-mae.png',
  Kuzunoha: 'kitsunes/kuzunoha.png',
  Tenko: 'kitsunes/tenko.png',
  Nogitsune: 'kitsunes/nogitsune.png',
  Byakko: 'kitsunes/byakko.png',
};

@Component({
  selector: 'app-kitsune-liste',
  imports: [RouterLink],
  templateUrl: './kitsune-liste.html',
  styleUrl: './kitsune-liste.scss',
})
export class KitsuneListe {
  protected readonly kitsunes = inject(GestionKitsunes).kitsunes;

  protected imageDe(nom: string): string | undefined {
    return IMAGES[nom];
  }
}
