import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionKitsunes } from '../gestion-kitsunes';
import { imageDe } from '../images-kitsunes';

@Component({
  selector: 'app-kitsune-liste',
  imports: [RouterLink],
  templateUrl: './kitsune-liste.html',
  styleUrl: './kitsune-liste.scss',
})
export class KitsuneListe {
  protected readonly kitsunes = inject(GestionKitsunes).kitsunes;
  protected readonly imageDe = imageDe;
}
