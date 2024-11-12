# 🕹️ Tic-Tac-Toe en Next.js avec IA (Minimax)

Ce projet est un jeu de **Tic-Tac-Toe** développé en **Next.js** avec **TypeScript**, utilisant l'algorithme **Minimax**
pour l'IA. Il propose également un mode **Multijoueur** pour jouer contre un autre joueur sur le même appareil.

## 🛠️ Technologies Utilisées

- **Next.js** (React avec App Router)
- **TypeScript** pour un typage robuste et sécurisé
- **Tailwind CSS** pour un style moderne et réactif
- **Minimax** avec optimisation pour l'algorithme d'IA
- **Neon** pour la base de données PostgreSQL
- **pnpm** pour la gestion efficace des paquets

## 🚀 Fonctionnalités

- **Mode Solo** : Jouez contre une IA performante basée sur Minimax
- **Mode Multijoueur** : Jouez à deux sur le même appareil
- **Choix du mode de jeu** : Sélection intuitive entre Solo et Multijoueur
- **Choix du premier joueur** : Définissez qui commence la partie (Joueur ou IA)
- **Algorithme Minimax avancé** : Prend en compte toutes les possibilités pour une IA intelligente
- **Détection automatique du gagnant** : Affichage clair du score et du vainqueur
- **Interface moderne** : Créée avec Tailwind CSS pour une expérience utilisateur agréable
- **Sauvegarde et Chargement de Partie** : Fonctionnalités pour sauvegarder et reprendre une partie
- **Mises à jour des Statistiques et du Classement** : Envoi des données à l'API pour mettre à jour le classement et les
  statistiques des parties.

## 📦 Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/antoinegreuzard/morpion.git tic-tac-toe
cd tic-tac-toe
```

2. Installez les dépendances avec **pnpm** :

```bash
pnpm install
```

3. Configuration de l'environnement :

Créez un fichier `.env.local` à la racine du projet et ajoutez les variables suivantes :

```bash
# URL de connexion à la base de données (Neon PostgreSQL)
DATABASE_URL=postgres://user:password@host:port/database

# Environnement (développement en local)
NODE_ENV=development
```

> **Note** : Assurez-vous que la variable `DATABASE_URL` pointe vers votre base de données Neon. Vous pouvez récupérer
> l'URL de connexion dans votre tableau de bord Neon.

4. Lancez le serveur de développement :

```bash
pnpm dev
```

Accédez à l'application dans votre navigateur à [http://localhost:3000](http://localhost:3000).

## 🧠 Algorithme Minimax

L'algorithme **Minimax** est utilisé pour évaluer tous les coups possibles et choisir le meilleur pour l'IA. Il maximise
les chances de victoire de l'IA tout en minimisant celles du joueur humain.

### Exemple d'évaluation :

- **X gagne** : Score de -10
- **O gagne** : Score de +10
- **Match nul** : Score de 0

L'algorithme utilise également l'optimisation **Alpha-Beta Pruning** pour réduire le nombre de calculs et accélérer la
prise de décision.

## 📁 Arborescence du Projet

```
tic-tac-toe/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── leaderboard/
│   │   │   │   └── route.ts
│   │   │   ├── load-game/
│   │   │   │   └── route.ts
│   │   │   ├── save-game/
│   │   │   │   └── route.ts
│   │   │   └── stats/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Board.tsx
│   │   ├── GameControls.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── ScoreBoard.tsx
│   │   ├── Square.tsx
│   │   └── Stats.tsx
│   ├── utils/
│   │   ├── checkWinner.ts
│   │   ├── db.ts
│   │   ├── getCanonicalForm.ts
│   │   └── minimax.ts
├── .env.local
├── .eslintrc.json
├── .gitignore
├── jest.config.mjs
├── jest.setup.js
├── LICENSE
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── SECURITY.md
├── tailwind.config.ts
└── tsconfig.json
```

## 📈 API et Sauvegarde des Données

Le projet inclut des API pour gérer les statistiques et le classement des joueurs :

- **/api/stats** :
  - `GET` : Récupère les statistiques globales (victoires IA, victoires joueur, matchs nuls).
  - `POST` : Met à jour les statistiques après chaque partie.

- **/api/leaderboard** :
  - `GET` : Récupère le classement des joueurs basé sur leurs scores.
  - `POST` : Met à jour le score d'un joueur.

- **/api/save-game** :
  - `POST` : Sauvegarde l'état actuel de la partie (plateau, score, joueur actif).

- **/api/load-game** :
  - `GET` : Charge l'état sauvegardé de la partie.

## 📝 Licence

Ce projet est sous licence MIT. Vous pouvez l'utiliser, le modifier et le distribuer librement.

## 👤 Auteur

Développé par Antoine Greuzard.
