# Tic-Tac-Toe en Next.js avec IA (Minimax)

Ce projet est un jeu de **Tic-Tac-Toe** développé en **Next.js** avec **TypeScript**, utilisant l'algorithme **Minimax**
pour l'IA. Il propose également un mode **Multijoueur** pour jouer contre un autre joueur.

## 🛠️ Technologies Utilisées

- **Next.js** (React avec App Router)
- **TypeScript** pour un typage robuste
- **Tailwind CSS** pour le style
- **Minimax** pour l'algorithme d'IA
- **pnpm** pour la gestion des paquets

## 🚀 Fonctionnalités

- **Solo** : Joueur contre IA
- **Multijoueur** : Deux joueurs sur le même appareil
- **Choix du mode de jeu** : Sélection du mode Solo ou Multijoueur
- **Sélection du premier joueur** : Choisissez qui commence (Joueur ou IA)
- **Algorithme Minimax optimisé** pour une IA performante
- **Détection automatique du gagnant** et affichage du score
- **Interface réactive et moderne** avec Tailwind CSS

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
│   │   └── Square.tsx
│   ├── utils/
│   │   ├── checkWinner.ts
│   │   └── minimax.ts
├── .eslintrc.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── package.json
└── README.md
```

## 📝 Licence

Ce projet est sous licence MIT. Vous pouvez l'utiliser librement.

## 👤 Auteur

Développé par Antoine Greuzard.
