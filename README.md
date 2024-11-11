# 🕹️ Tic-Tac-Toe en Next.js avec IA (Minimax)

Ce projet est un jeu de **Tic-Tac-Toe** développé en **Next.js** avec **TypeScript**, utilisant l'algorithme **Minimax**
pour l'IA. Il propose également un mode **Multijoueur** pour jouer contre un autre joueur sur le même appareil.

## 🛠️ Technologies Utilisées

- **Next.js** (React avec App Router)
- **TypeScript** pour un typage robuste et sécurisé
- **Tailwind CSS** pour un style moderne et réactif
- **Minimax** avec optimisation pour l'algorithme d'IA
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

3. Lancez le serveur de développement :

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
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Board.tsx
│   │   ├── Square.tsx
│   │   ├── ScoreBoard.tsx
│   │   ├── GameControls.tsx
│   │   ├── Leaderboard.tsx
│   │   └── Stats.tsx
│   ├── utils/
│   │   ├── checkWinner.ts
│   │   ├── minimax.ts
│   │   └── gameStore.ts
├── .eslintrc.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

## 📝 Licence

Ce projet est sous licence MIT. Vous pouvez l'utiliser, le modifier et le distribuer librement.

## 👤 Auteur

Développé par Antoine Greuzard.
