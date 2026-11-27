import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GestionKitsunes } from '../kitsunes/gestion-kitsunes';

type Critere = 'victoires' | 'pv' | 'force' | 'vitesse';

const CRITERES: { valeur: Critere; libelle: string; unite: string }[] = [
  { valeur: 'victoires', libelle: 'Le plus de victoires', unite: 'victoire(s)' },
  { valeur: 'pv', libelle: 'Le plus résistant', unite: 'PV' },
  { valeur: 'force', libelle: 'Le plus fort', unite: 'de force' },
  { valeur: 'vitesse', libelle: 'Le plus rapide', unite: 'de vitesse' },
];

@Component({
  selector: 'app-accueil',
  imports: [RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {
  private readonly gestionKitsunes = inject(GestionKitsunes);

  protected readonly criteres = CRITERES;
  protected readonly critere = signal<Critere>('victoires');
  protected readonly unite = computed(
    () => CRITERES.find((option) => option.valeur === this.critere())?.unite,
  );

  // Les 3 meilleurs selon le critère choisi (copie avant le tri pour ne pas toucher la liste)
  protected readonly podium = computed(() => {
    const critere = this.critere();
    return [...this.gestionKitsunes.kitsunes()].sort((a, b) => b[critere] - a[critere]).slice(0, 3);
  });
}
