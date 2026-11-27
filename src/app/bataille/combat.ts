import { Kitsune } from '../kitsunes/kitsune';

export interface ResultatCombat {
  gagnant: Kitsune;
  perdant: Kitsune;
  nbAttaques: number;
}

/** Un Kitsune pendant le combat, avec ses PV du moment (copie, l'original n'est pas touché). */
interface Combattant {
  kitsune: Kitsune;
  pv: number;
}

export function simulerCombat(premier: Kitsune, second: Kitsune): ResultatCombat {
  let [attaquant, defenseur] = ordreDePassage(entrerDansLArene(premier), entrerDansLArene(second));
  let nbAttaques = 0;

  // Se termine forcément : la force minimale d'un Kitsune est de 1
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

/** Le plus rapide attaque en premier ; à vitesse égale, on tire au sort. */
function ordreDePassage(a: Combattant, b: Combattant): [Combattant, Combattant] {
  const ecart = a.kitsune.vitesse - b.kitsune.vitesse;
  const aCommence = ecart === 0 ? Math.random() < 0.5 : ecart > 0;
  return aCommence ? [a, b] : [b, a];
}
