export interface Kitsune {
  nom: string;
  description: string;
  pv: number;
  force: number;
  vitesse: number;
  enRepos: boolean;
  victoires: number;
  boost: boolean;
}

/** Ce que l'utilisateur saisit à la création : le reste prend une valeur par défaut. */
export type NouveauKitsune = Pick<Kitsune, 'nom' | 'description' | 'pv' | 'force' | 'vitesse'>;
