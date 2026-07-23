# 🎨 Sophie Bluel — Portfolio d'architecte d'intérieur

> Partie dynamique (JavaScript) du site portfolio de l'architecte d'intérieur Sophie Bluel : galerie, filtres et espace d'administration connectés à une API REST.

## 🎯 Contexte du projet

Sophie Bluel, architecte d'intérieur, dispose d'un site portfolio statique. L'objectif est de le rendre **dynamique** et de lui ajouter un espace d'administration.

**Mission :** développer la partie front-end dynamique en **JavaScript** (affichage de la galerie, filtres, page de connexion, ajout et suppression de projets) en consommant une **API REST**, à partir d'une base HTML/CSS et d'un back-end fournis par "le client".

## 🛠️ Technologies utilisées

- **HTML5** — structure sémantique
- **CSS3** — Flexbox, Grid, media queries (responsive), `calc()`, `aspect-ratio`
- **JavaScript (ES6+)** — Fetch API, `async/await`, manipulation du DOM, `FormData`
- **Modules ES** — code organisé en modules (données, état, vues, point d'entrée)
- **API REST** — back-end Node.js / Express / SQLite (fourni), authentification par token (JWT)
- **Font Awesome** — bibliothèque d'icônes
- **Google Fonts** — typographies (Syne, Work Sans)
- **Git / GitHub** — versioning

## ✨ Fonctionnalités principales

- ✅ Affichage **dynamique** de la galerie depuis l'API
- ✅ Filtres par catégorie
- ✅ Page de connexion avec **authentification par token**
- ✅ Espace administrateur : **ajout** (upload d'image via une modale) et **suppression** de projets
- ✅ Mise à jour de la galerie **sans rechargement** de la page
- ✅ Site responsive (mobile, tablette, desktop)
- ✅ Code conforme aux standards W3C

## 🚀 Installation et lancement

> ⚠️ Ce projet nécessite un **back-end local** : il n'y a pas de démo en ligne (GitHub Pages n'exécute pas de serveur Node).

**Prérequis :** [Node.js](https://nodejs.org/) et npm.

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/leaspadea/sophie-bluel-portfolio.git
   ```

2. **Lancer le back-end (API)** dans un terminal :
   ```bash
   cd sophie-bluel-portfolio/Backend
   npm install
   npm start
   ```
   L'API tourne sur `http://localhost:5678` — **laisser ce terminal ouvert**.

3. **Lancer le front-end**
   Ouvrir `FrontEnd/index.html` avec l'extension **Live Server** de VS Code.

**Compte de test** pour l'espace admin : `sophie.bluel@test.tld` / `S0phie`

## 📐 Structure du projet

```
sophie-bluel-portfolio/
├── Backend/                 # API fournie (Node.js / Express / SQLite)
├── FrontEnd/
│   ├── index.html           # page d'accueil
│   ├── login.html           # page de connexion
│   └── assets/
│       ├── style.css        # styles
│       ├── js/
│       │   ├── main.js      # point d'entrée de l'accueil
│       │   ├── api.js       # appels à l'API (couche données)
│       │   ├── store.js     # état partagé entre les modules
│       │   ├── gallery.js   # galerie et filtres
│       │   ├── modal.js     # modale (ajout / suppression)
│       │   ├── auth.js      # connexion et mode administrateur
│       │   └── login.js     # logique de la page de connexion
│       ├── icons/
│       └── images/
└── README.md
```

## 🎓 Compétences travaillées

- Consommation d'une **API REST** (Fetch, `async/await`)
- Manipulation **dynamique du DOM** (création, mise à jour, suppression d'éléments)
- **Authentification** par token (JWT) et stockage via `localStorage`
- Envoi de fichiers au serveur avec **`FormData`** (multipart)
- Gestion des **événements** et des **formulaires**
- Intégration responsive et validation W3C

## 👤 Auteur

**Léa Spadea** — Étudiante Intégratrice Web @ OpenClassrooms
🔗 [LinkedIn](https://www.linkedin.com/in/lea-spadea/) · 💻 [GitHub](https://github.com/leaspadea)

---

*Projet réalisé dans le cadre de la formation Intégrateur Web (RNCP niveau 5) chez OpenClassrooms.*
