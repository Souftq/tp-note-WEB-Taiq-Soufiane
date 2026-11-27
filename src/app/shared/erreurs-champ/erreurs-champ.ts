import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

// Affiche les erreurs d'un champ une fois qu'il a été touché
@Component({
  selector: 'app-erreurs-champ',
  templateUrl: './erreurs-champ.html',
  styleUrl: './erreurs-champ.scss',
})
export class ErreursChamp {
  readonly erreurs = input.required<readonly ValidationError[]>();
  readonly visible = input.required<boolean>();
}
