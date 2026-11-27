# Kitsunes Battle

Évaluation pratique de Programmation Front-End (ENSIM 4A FISA, 2026).
Application Angular 22 (SCSS, sans SSR) qui permet de consulter, créer, booster et faire combattre des Kitsune.

## Lancer le projet

```bash
npm install
ng serve
```

Puis ouvrir http://localhost:4200.

## Arborescence

```
src/app
├── kitsunes/                  fonctionnalité "Kitsune"
│   ├── kitsune.ts             interface Kitsune + type NouveauKitsune
│   ├── gestion-kitsunes.ts    service : données et règles métier
│   ├── kitsune-liste/         écran Liste
│   ├── kitsune-detail/        écran Détails (+ boost)
│   ├── kitsune-ajout/         écran Ajout (formulaire)
│   └── kitsune-introuvable/   écran affiché quand le Kitsune n'existe pas
├── bataille/
│   ├── bataille.*             écran Bataille
│   └── combat.ts              déroulé d'un combat (fonction pure)
├── shared/
│   ├── navigation/            barre de navigation
│   └── erreurs-champ/         affichage des erreurs d'un champ de formulaire
├── app.routes.ts
└── app.*                      composant racine
```

J'ai rangé les fichiers par fonctionnalité, comme vu en cours, avec un dossier `shared` pour ce qui sert partout.

## Choix techniques

**Données dans un service.** `GestionKitsunes` garde la liste dans un signal privé et n'expose qu'une version
en lecture seule (`asReadonly()`). Toute modification passe par une méthode du service (`ajouter`,
`tenterBoost`, `enregistrerCombat`) : les composants ne peuvent pas modifier la liste par erreur.
Les mises à jour se font sans muter les objets (`map` + spread), sinon les `computed` ne verraient pas le changement.

**Le nom comme identifiant.** Le sujet impose un nom unique et ne prévoit pas d'`id`. Plutôt que d'ajouter
un champ, j'utilise le nom dans l'URL : `/kitsunes/Tenko`. La vérification d'unicité ignore la casse et les
espaces (`"tenko "` est refusé si `Tenko` existe).

**Écran "introuvable" dans le détail.** Le composant `KitsuneIntrouvable` est affiché par `KitsuneDetail` dans
un `@else` quand le nom ne correspond à rien. L'URL reste celle demandée, ce qui me paraît plus honnête pour
l'utilisateur qu'une redirection. Une URL complètement inconnue renvoie vers la liste.

**Boost.** Le tirage (25 %) est fait dans le service. Le compteur d'échecs, lui, est un état d'écran : il vit
dans le composant et repart à zéro quand on revient sur la page. Le bouton se bloque quand le Kitsune est
boosté (au chargement ou juste après un tirage réussi) ou après 3 échecs d'affilée.

**Combat.** `simulerCombat` est une fonction pure, isolée dans `combat.ts` : elle ne dépend pas d'Angular et
se lit de haut en bas. Elle travaille sur des copies des PV (doublés si boost), donc les PV d'origine ne sont
jamais touchés : c'est ce qui assure la règle « remettre les PV à leurs valeurs initiales ».
Le vainqueur est calculé tout de suite, mais le résultat n'est affiché et enregistré qu'après 3 secondes.
Le perdant passe en repos et un `setTimeout` le remet disponible au bout d'une minute.

**Formulaire.** J'ai utilisé les Signal Forms (vus en dernier en cours) : le modèle est un signal, les
validateurs sont déclarés dans le schéma TS (obligatoire, longueur max, minimum à 1, nom unique via
`validate`). Les attributs `enRepos`, `victoires` et `boost` ne sont pas dans le formulaire, ils prennent leur
valeur par défaut dans `GestionKitsunes.ajouter`.

**Barre de navigation collée en haut.** `position: sticky` sur le composant hôte (`:host`).

## Difficultés rencontrées

- Avec les Signal Forms, Angular refuse les attributs de validation HTML (`min="1"`) sur un champ relié par
  `[formField]` (erreur NG8022). La validation doit être déclarée uniquement dans le schéma TS.
- Une force de 0 rendrait le combat infini. Plutôt que d'ajouter une protection dans la boucle, j'empêche ce
  cas à la source : le formulaire impose une force d'au moins 1.

## Limites connues

- Les données sont en mémoire : un rechargement de la page remet la liste de départ.
- Si l'on quitte l'écran Bataille pendant les 3 secondes, le combat est quand même enregistré
  (il a déjà eu lieu), on ne voit simplement pas le message de résultat.
