import { Service, signal } from '@angular/core';
import { Kitsune, NouveauKitsune } from './kitsune';

const CHANCE_BOOST = 0.25;
const DUREE_REPOS_MS = 60_000;

@Service()
export class GestionKitsunes {
  private readonly listeKitsunes = signal<Kitsune[]>([
    {
      nom: 'Kyūbi',
      description: 'Le doyen aux neuf queues. Lent, mais rien ne semble pouvoir le faire tomber.',
      pv: 140,
      force: 14,
      vitesse: 6,
      enRepos: false,
      victoires: 4,
      boost: false,
    },
    {
      nom: 'Akane',
      description: 'Renarde de feu au caractère explosif, elle frappe toujours la première.',
      pv: 85,
      force: 18,
      vitesse: 15,
      enRepos: false,
      victoires: 2,
      boost: true,
    },
    {
      nom: 'Yuki',
      description: 'Née pendant une tempête de neige, elle esquive plus qu’elle ne cogne.',
      pv: 95,
      force: 11,
      vitesse: 13,
      enRepos: false,
      victoires: 1,
      boost: false,
    },
    {
      nom: 'Raiden',
      description: 'Il court plus vite que l’éclair dont il porte le nom.',
      pv: 75,
      force: 12,
      vitesse: 18,
      enRepos: false,
      victoires: 3,
      boost: false,
    },
    {
      nom: 'Hoshi',
      description: 'Une jeune renarde qui ne sort que la nuit. Encore inexpérimentée.',
      pv: 100,
      force: 10,
      vitesse: 10,
      enRepos: false,
      victoires: 0,
      boost: false,
    },
  ]);

  public readonly kitsunes = this.listeKitsunes.asReadonly();

  trouver(nom: string): Kitsune | undefined {
    return this.listeKitsunes().find((kitsune) => kitsune.nom === nom);
  }

  /** La comparaison ignore la casse et les espaces autour : "akane " est pris si "Akane" existe. */
  nomDisponible(nom: string): boolean {
    const nomNormalise = nom.trim().toLowerCase();
    return !this.listeKitsunes().some((kitsune) => kitsune.nom.toLowerCase() === nomNormalise);
  }

  ajouter(nouveau: NouveauKitsune): void {
    const kitsune: Kitsune = {
      ...nouveau,
      nom: nouveau.nom.trim(),
      enRepos: false,
      victoires: 0,
      boost: false,
    };
    this.listeKitsunes.update((liste) => [...liste, kitsune]);
  }

  /** Tire au sort le boost. Renvoie true si le Kitsune est désormais boosté. */
  tenterBoost(nom: string): boolean {
    const reussi = Math.random() < CHANCE_BOOST;
    if (reussi) {
      this.modifier(nom, { boost: true });
    }
    return reussi;
  }

  /**
   * Les PV ne sont jamais modifiés ici : le combat travaille sur des copies,
   * donc ils restent à leur valeur initiale après la bataille.
   */
  enregistrerCombat(gagnant: Kitsune, perdant: Kitsune): void {
    this.listeKitsunes.update((liste) =>
      liste.map((kitsune) => {
        if (kitsune.nom === gagnant.nom) {
          return { ...kitsune, victoires: kitsune.victoires + 1, boost: false };
        }
        if (kitsune.nom === perdant.nom) {
          return { ...kitsune, enRepos: true, boost: false };
        }
        return kitsune;
      }),
    );

    setTimeout(() => this.modifier(perdant.nom, { enRepos: false }), DUREE_REPOS_MS);
  }

  private modifier(nom: string, changements: Partial<Kitsune>): void {
    this.listeKitsunes.update((liste) =>
      liste.map((kitsune) => (kitsune.nom === nom ? { ...kitsune, ...changements } : kitsune)),
    );
  }
}
