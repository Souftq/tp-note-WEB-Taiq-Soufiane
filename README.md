# Kitsunes Battle

**Soufiane TAIQ** – ENSIM 4A FISA, évaluation pratique de Programmation Front-End (2026).

Application Angular 22 (SCSS, sans SSR) qui permet de consulter, créer, booster et faire combattre des Kitsune.

## Prérequis

- Node.js 26 (testé avec la 26.13.1)
- Angular CLI 22.3 (installée avec les dépendances du projet)

## Lancer le projet

```bash
npm install
npm start
```

Puis ouvrir http://localhost:4200.

## Fonctionnalités

Tout ce que demande le sujet est implémenté :

- [x] **Données** : 5 Kitsune de départ dans le service `GestionKitsunes`, avec tous les attributs demandés.
- [x] **Liste** (`/kitsunes`) : nom et état de repos uniquement ; un Kitsune boosté a une bordure lumineuse.
- [x] **Détails** (`/kitsunes/:nom`) : tous les attributs et le bouton de boost (25 % de chance). Le bouton
      est désactivé si le Kitsune est déjà boosté, ou après 3 échecs d'affilée.
- [x] **Ajout** (`/ajout`) : formulaire avec validation. Valeurs par défaut : `enRepos = false`,
      `victoires = 0`, `boost = false`. Un nom déjà pris est refusé.
- [x] **Introuvable** : titre « Kitsune non trouvé », message demandé et lien vers la liste.
- [x] **Bataille** (`/bataille`) :
  - seuls les Kitsune disponibles combattent ; s'il en reste moins de deux, un message le signale ;
  - le bouton « Combat ! » apparaît une fois deux Kitsune choisis, et il est désactivé pendant le combat ;
  - le résultat s'affiche après 3 secondes ;
  - le perdant se repose 1 minute ;
  - les PV restent à leur valeur initiale, le boost est remis à `false` et la sélection est vidée.
- [x] **Navigation** : barre collée en haut de la page, même au défilement.

## Bonus (branche `bonus`, non notés)

- [x] **Sauvegarde** : la liste est enregistrée dans le `localStorage` et relue au démarrage.
- [x] **Podium** sur la page d'accueil (`/accueil`) : les 3 meilleurs Kitsune, classés par victoires par
      défaut. Des boutons permettent de changer de critère : le plus résistant (PV), le plus fort, le plus rapide.

## Arborescence

```
src/app
├── accueil/                   page d'accueil avec le podium (bonus)
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

Les fichiers sont rangés par fonctionnalité, avec un dossier `shared` pour ce qui sert à plusieurs écrans.

## Choix techniques

**Données dans un service.** `GestionKitsunes` garde la liste dans un signal privé et n'expose qu'une version
en lecture seule (`asReadonly()`). Toute modification passe par une méthode du service : `ajouter`,
`tenterBoost` ou `enregistrerCombat`. Les composants ne peuvent donc pas modifier la liste par erreur.
Les mises à jour se font sans muter les objets (`map` + spread), sinon les `computed` ne verraient pas le changement.

**Le nom comme identifiant.** Le sujet impose un nom unique et ne prévoit pas d'`id`. Plutôt que d'ajouter
un champ, j'utilise le nom dans l'URL : `/kitsunes/Tenko`. La recherche et la vérification d'unicité suivent
la même règle, elles ignorent la casse et les espaces autour du nom :

- `/kitsunes/tenko` affiche Tenko ;
- le nom `"tenko "` est refusé à la création si `Tenko` existe.

`routerLink` encode les espaces et les accents dans l'URL, et Angular les décode à la lecture.

**Écran "introuvable" dans le détail.** Quand le nom ne correspond à rien, `KitsuneDetail` affiche le
composant `KitsuneIntrouvable` dans un `@else`. L'URL reste celle demandée, ce qui me paraît plus clair pour
l'utilisateur qu'une redirection. Une URL complètement inconnue renvoie vers la liste.

**Boost.** Le tirage (25 %) est fait dans le service. Le compteur d'échecs est un état d'écran : il vit dans
le composant et repart à zéro quand on revient sur la page. Le bouton se bloque dans deux cas :

- le Kitsune est boosté, dès le chargement ou juste après un tirage réussi ;
- il y a eu 3 échecs d'affilée.

**Combat.** `simulerCombat` est une fonction pure, isolée dans `combat.ts` : elle ne dépend pas d'Angular et
se lit de haut en bas. Elle travaille sur des copies des PV (doublés si boost), donc les PV d'origine ne sont
jamais modifiés. C'est ce qui assure la règle « remettre les PV à leurs valeurs initiales ».
Le vainqueur est calculé tout de suite, mais le résultat n'est affiché et enregistré qu'après 3 secondes.
Le perdant passe en repos, et un `setTimeout` le rend de nouveau disponible au bout d'une minute.

**Formulaire.** Il utilise les Signal Forms : le modèle est un signal, et les validateurs sont déclarés dans
le schéma TS (champ obligatoire, longueur maximale, minimum à 1, nom unique et nom qui ne contient pas que des
espaces via `validate`). Les attributs
`enRepos`, `victoires` et `boost` ne sont pas dans le formulaire : ils prennent leur valeur par défaut dans
`GestionKitsunes.ajouter`.

**Barre de navigation collée en haut.** `position: sticky` sur le composant hôte (`:host`).

## Interprétations et choix personnels

- **Boost après un combat** : je remets `boost` à `false` uniquement pour les deux Kitsune qui ont combattu,
  pas pour toute la liste.
- **Liste** : le sujet n'autorise que `nom` et `enRepos`. Sur la liste, le boost est donc signalé seulement
  par un style (la bordure lumineuse), sans texte. La pastille « Boosté » apparaît sur les écrans Détails et
  Bataille.
- **Kitsune de départ** : inspirés de la mythologie japonaise (Tamamo-no-Mae, Kuzunoha, Tenko…).
- **Pas d'emojis** dans l'interface : j'ai préféré un badge en CSS, plus sobre.

## Difficultés rencontrées

- Avec les Signal Forms, Angular refuse les attributs de validation HTML (`min="1"`) sur un champ relié par
  `[formField]` (erreur NG8022). La validation doit être déclarée uniquement dans le schéma TS.
- Une force de 0 rendrait le combat infini. Plutôt que d'ajouter une protection dans la boucle, j'empêche ce
  cas à la source : le formulaire impose une force d'au moins 1.

## Limites connues

- Les Kitsune sont sauvegardés dans le `localStorage` (bonus). Les minuteurs de repos, eux, ne survivent pas à
  un rechargement : tous les Kitsune redeviennent disponibles.
- Si l'on quitte l'écran Bataille pendant les 3 secondes, le combat est quand même enregistré, puisqu'il a
  déjà eu lieu. On ne voit simplement pas le message de résultat.
