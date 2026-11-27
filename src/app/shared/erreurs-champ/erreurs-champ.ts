import { Component, input } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';

/** Affiche les messages d'erreur d'un champ, une fois que l'utilisateur l'a touché. */
@Component({
  selector: 'app-erreurs-champ',
  templateUrl: './erreurs-champ.html',
  styleUrl: './erreurs-champ.scss',
})
export class ErreursChamp {
  readonly erreurs = input.required<readonly ValidationError[]>();
  readonly visible = input.required<boolean>();
}
