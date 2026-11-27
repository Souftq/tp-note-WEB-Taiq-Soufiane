import { Service, effect, signal } from '@angular/core';
import { Kitsune, NouveauKitsune } from './kitsune';

const CHANCE_BOOST = 0.25;
const DUREE_REPOS_MS = 60_000;
const CLE_STOCKAGE = 'kitsunes';

function normaliser(nom: string): string {
  return nom.trim().toLowerCase();
}

const KITSUNES_DE_DEPART: Kitsune[] = [
  {
    nom: 'Tamamo-no-Mae',
    description:
      "La plus célèbre des renardes à neuf queues. Elle a charmé la cour impériale avant d'être démasquée.",
    pv: 120,
    force: 16,
    vitesse: 12,
    enRepos: false,
    victoires: 5,
    boost: false,
  },
  {
    nom: 'Kuzunoha',
    description:
      "Renarde blanche messagère d'Inari, aussi sage que protectrice. Mère légendaire d'Abe no Seimei.",
    pv: 110,
    force: 11,
    vitesse: 11,
    enRepos: false,
    victoires: 2,
    boost: false,
  },
  {
    nom: 'Tenko',
    description:
      'Kitsune céleste millénaire. Lent à se mettre en mouvement, mais presque impossible à mettre à terre.',
    pv: 150,
    force: 13,
    vitesse: 7,
    enRepos: false,
    victoires: 3,
    boost: true,
  },
  {
    nom: 'Nogitsune',
    description:
      'Renard sauvage et malicieux qui sème le chaos partout où il passe. Il frappe fort, mais encaisse mal.',
    pv: 80,
    force: 19,
    vitesse: 16,
    enRepos: false,
    victoires: 1,
    boost: false,
  },
  {
    nom: 'Byakko',
    description:
      "Esprit au pelage blanc, bienveillant et vif comme le vent. Il manque encore d'expérience.",
    pv: 95,
    force: 12,
    vitesse: 18,
    enRepos: false,
    victoires: 0,
    boost: false,
  },
];

// Relit la liste sauvegardée, sinon on repart des Kitsune de départ
function chargerKitsunes(): Kitsune[] {
  const sauvegarde = localStorage.getItem(CLE_STOCKAGE);
  if (!sauvegarde) {
    return KITSUNES_DE_DEPART;
  }
  try {
    const kitsunes: Kitsune[] = JSON.parse(sauvegarde);
    // Les minuteurs de repos sont perdus au rechargement, donc tout le monde redevient disponible
    return kitsunes.map((kitsune) => ({ ...kitsune, enRepos: false }));
  } catch {
    return KITSUNES_DE_DEPART;
  }
}

@Service()
export class GestionKitsunes {
  private readonly listeKitsunes = signal<Kitsune[]>(chargerKitsunes());

  public readonly kitsunes = this.listeKitsunes.asReadonly();

  constructor() {
    // Sauvegarde à chaque modification de la liste
    effect(() => localStorage.setItem(CLE_STOCKAGE, JSON.stringify(this.listeKitsunes())));
  }

  // Sans tenir compte des majuscules : /kitsunes/tenko trouve Tenko
  trouver(nom: string): Kitsune | undefined {
    const nomNormalise = normaliser(nom);
    return this.listeKitsunes().find((kitsune) => normaliser(kitsune.nom) === nomNormalise);
  }

  // "tenko " est refusé si Tenko existe déjà
  nomDisponible(nom: string): boolean {
    return this.trouver(nom) === undefined;
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

  // 25 % de chance, renvoie true si le boost a marché
  tenterBoost(nom: string): boolean {
    const reussi = Math.random() < CHANCE_BOOST;
    if (reussi) {
      this.modifier(nom, { boost: true });
    }
    return reussi;
  }

  // On ne touche pas aux PV : le combat a travaillé sur des copies
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
