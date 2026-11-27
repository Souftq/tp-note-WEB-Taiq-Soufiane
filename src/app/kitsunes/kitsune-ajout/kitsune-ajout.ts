import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormField,
  FormRoot,
  form,
  maxLength,
  min,
  required,
  validate,
} from '@angular/forms/signals';
import { GestionKitsunes } from '../gestion-kitsunes';
import { NouveauKitsune } from '../kitsune';
import { ErreursChamp } from '../../shared/erreurs-champ/erreurs-champ';

const VALEURS_PAR_DEFAUT: NouveauKitsune = {
  nom: '',
  description: '',
  pv: 100,
  force: 10,
  vitesse: 10,
};

@Component({
  selector: 'app-kitsune-ajout',
  imports: [FormRoot, FormField, ErreursChamp],
  templateUrl: './kitsune-ajout.html',
  styleUrl: './kitsune-ajout.scss',
})
export class KitsuneAjout {
  private readonly gestionKitsunes = inject(GestionKitsunes);
  private readonly router = inject(Router);

  protected readonly modele = signal<NouveauKitsune>({ ...VALEURS_PAR_DEFAUT });

  protected readonly formulaire = form(
    this.modele,
    (champs) => {
      required(champs.nom, { message: 'Le nom est obligatoire.' });
      maxLength(champs.nom, 30, { message: 'Le nom ne doit pas dépasser 30 caractères.' });
      validate(champs.nom, ({ value }) =>
        this.gestionKitsunes.nomDisponible(value())
          ? undefined
          : { kind: 'nomDejaPris', message: 'Ce nom est déjà porté par un autre Kitsune.' },
      );

      required(champs.description, { message: 'Une petite description est obligatoire.' });

      // Avec une force à 0, le combat ne finirait jamais
      required(champs.pv, { message: 'Les PV sont obligatoires.' });
      min(champs.pv, 1, { message: 'Les PV doivent valoir au moins 1.' });
      required(champs.force, { message: 'La force est obligatoire.' });
      min(champs.force, 1, { message: 'La force doit valoir au moins 1.' });
      required(champs.vitesse, { message: 'La vitesse est obligatoire.' });
      min(champs.vitesse, 1, { message: 'La vitesse doit valoir au moins 1.' });
    },
    {
      submission: {
        action: async (champs) => {
          const nouveau = champs().value();
          this.gestionKitsunes.ajouter(nouveau);
          await this.router.navigate(['/kitsunes', nouveau.nom.trim()]);
          return undefined;
        },
      },
    },
  );
}
