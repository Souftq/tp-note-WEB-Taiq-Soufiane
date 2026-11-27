import { Component, computed, inject, signal } from '@angular/core';
import { GestionKitsunes } from '../kitsunes/gestion-kitsunes';
import { ResultatCombat, simulerCombat } from './combat';

const DELAI_RESULTAT_MS = 3000;

@Component({
  selector: 'app-bataille',
  templateUrl: './bataille.html',
  styleUrl: './bataille.scss',
})
export class Bataille {
  private readonly gestionKitsunes = inject(GestionKitsunes);

  protected readonly disponibles = computed(() =>
    this.gestionKitsunes.kitsunes().filter((kitsune) => !kitsune.enRepos),
  );
  protected readonly assezDeCombattants = computed(() => this.disponibles().length >= 2);

  // Les noms des Kitsune choisis (2 max)
  protected readonly selection = signal<string[]>([]);
  protected readonly selectionComplete = computed(() => this.selection().length === 2);

  protected readonly combatEnCours = signal(false);
  protected readonly resultat = signal<ResultatCombat | null>(null);

  protected estSelectionne(nom: string): boolean {
    return this.selection().includes(nom);
  }

  protected basculerSelection(nom: string): void {
    this.selection.update((noms) => {
      if (noms.includes(nom)) {
        return noms.filter((n) => n !== nom);
      }
      return noms.length < 2 ? [...noms, nom] : noms;
    });
  }

  protected lancerCombat(): void {
    const combattants = this.selection()
      .map((nom) => this.gestionKitsunes.trouver(nom))
      .filter((kitsune) => kitsune !== undefined);

    if (combattants.length !== 2 || this.combatEnCours()) {
      return;
    }

    this.resultat.set(null);
    this.combatEnCours.set(true);

    const resultat = simulerCombat(combattants[0], combattants[1]);

    // Le gagnant est déjà calculé, on attend juste 3 s avant de l'afficher
    setTimeout(() => {
      this.gestionKitsunes.enregistrerCombat(resultat.gagnant, resultat.perdant);
      this.resultat.set(resultat);
      this.selection.set([]);
      this.combatEnCours.set(false);
    }, DELAI_RESULTAT_MS);
  }
}
