import { Kitsune } from '../kitsunes/kitsune';

export interface ResultatCombat {
  gagnant: Kitsune;
  perdant: Kitsune;
  nbAttaques: number;
}

// Copie du Kitsune pour le combat, ses PV d'origine ne bougent pas
interface Combattant {
  kitsune: Kitsune;
  pv: number;
}

export function simulerCombat(premier: Kitsune, second: Kitsune): ResultatCombat {
  let [attaquant, defenseur] = ordreDePassage(entrerDansLArene(premier), entrerDansLArene(second));
  let nbAttaques = 0;

  // Pas de boucle infinie : la force vaut au moins 1
  while (true) {
    defenseur.pv -= attaquant.kitsune.force;
    nbAttaques++;

    if (defenseur.pv <= 0) {
      return { gagnant: attaquant.kitsune, perdant: defenseur.kitsune, nbAttaques };
    }

    [attaquant, defenseur] = [defenseur, attaquant];
  }
}

function entrerDansLArene(kitsune: Kitsune): Combattant {
  return { kitsune, pv: kitsune.boost ? kitsune.pv * 2 : kitsune.pv };
}

// Le plus rapide commence, en cas d'égalité on tire au sort
function ordreDePassage(a: Combattant, b: Combattant): [Combattant, Combattant] {
  const ecart = a.kitsune.vitesse - b.kitsune.vitesse;
  const aCommence = ecart === 0 ? Math.random() < 0.5 : ecart > 0;
  return aCommence ? [a, b] : [b, a];
}
