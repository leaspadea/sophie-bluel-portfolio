# NOTES — Projet 6 : Portfolio Sophie Bluel

Journal de bord du projet (mise en place, choix techniques, points clés pour la
soutenance). Mis à jour au fur et à mesure, après chaque étape validée.

---

## Environnement (mise en place)

### Outils vérifiés (déjà installés)
- Node.js **v24.15.0**, npm **11.12.1**
- git **2.53.0**, GitHub CLI **2.92.0**

### Dépôt
- Cloné depuis le dépôt officiel OpenClassrooms :
  `https://github.com/OpenClassrooms-Student-Center/Portfolio-architecte-sophie-bluel`
- Emplacement local : `C:\Users\Miaou\sophie-bluel`
- Contenu : `Backend/` (API fournie), `FrontEnd/` (site à dynamiser).

### Backend (API)
- Commandes issues du **vrai** `Backend/README.md` (non devinées) :
  - `npm install` (dans `Backend/`)
  - `npm start` → exécute `node server` (fichier `server.js`)
- **Port de l'API : `5678`** → `http://localhost:5678`
- Doc interactive (Swagger) : `http://localhost:5678/api-docs/`
- Compte de test : `sophie.bluel@test.tld` / `S0phie`
- Stack backend : Express, SQLite, JSON Web Token (JWT), multer (upload), bcrypt.
- **Le terminal du serveur doit rester ouvert** pendant tout le développement.

### Point de vigilance : vulnérabilités npm
- `npm install` signale des vulnérabilités (dépendances figées par OpenClassrooms).
- **Ne PAS lancer `npm audit fix --force`** : cela mettrait à jour les dépendances
  et risquerait de casser l'API fournie. Backend en local uniquement → non exposé.
- Comportement attendu : on laisse tel quel.

### Vérification de fonctionnement
- `GET http://localhost:5678/api/works` → **HTTP 200** + liste JSON des projets.
- API confirmée opérationnelle avant de démarrer le code Frontend.

---

## Frontend statique
- Lancé avec Live Server (VS Code), rendu dans le navigateur. Galerie visible. ✅

---

## JavaScript — Galerie dynamique

### Câblage du script
- Fichier `assets/script.js` lié dans `index.html` avec l'attribut **`defer`**.
- `defer` = le script s'exécute une fois tout le HTML chargé (évite de manipuler
  des éléments qui n'existent pas encore). Pratique recommandée.

### Récupération des données (fetch)
- `fetch("http://localhost:5678/api/works")` récupère les projets depuis l'API.
- Fonction `async` + `await` :
  - 1er `await` : attend la réponse du serveur.
  - 2e `await` (`.json()`) : convertit la réponse (texte JSON) en tableau d'objets JS.
- Vérifié : la console affiche bien un tableau de 11 projets.

---

### Affichage dynamique (DOM)
- Galerie statique du HTML vidée (`<div class="gallery"></div>`).
- `displayWorks(works)` construit chaque projet avec `document.createElement`
  (`figure` > `img` + `figcaption`), remplit `.src` / `.alt` / `.textContent`,
  puis emboîte avec `appendChild`.
- Choix `createElement` + `textContent` plutôt qu'`innerHTML` : plus sûr
  (texte brut jamais interprété comme du code → protection XSS).
- `init()` orchestre : `await fetchWorks()` PUIS `displayWorks()`.
- Piège rencontré : fonctions imbriquées au lieu d'empilées → chaque fonction
  doit être fermée par son `}` avant la suivante. Code après un `return` ignoré.

---

### Filtres par catégorie
- `fetchCategories()` récupère les catégories via `/api/categories` (3 catégories).
- `displayFilters(categories)` génère 4 `<button>` : "Tous" (ajouté à la main,
  `data-category-id="0"`) + un par catégorie (`data-category-id` = id de l'API).
- Choix de vrais `<button>` (accessibles clavier/lecteur d'écran) vs `<div>`.
- Variable d'état `allWorks` (en haut, `let`) : stocke la liste complète pour
  pouvoir filtrer dessus à tout moment.
- `displayWorks` vide la galerie (`gallery.innerHTML = ""`) avant d'afficher,
  sinon les projets s'empilent. `innerHTML = ""` sûr car aucune donnée injectée.
- Au clic : `addEventListener("click", ...)` → lit `dataset.categoryId`,
  le convertit en nombre (`Number(...)`, car dataset renvoie du texte), puis
  `allWorks.filter(...)` crée une sous-liste, passée à `displayWorks`.
- Notions clés : `dataset` (data-*), `addEventListener`, `.filter()`.

---

## Versionnement Git
- Historique OpenClassrooms supprimé, réinitialisé pour n'avoir que mes commits.
- `.gitignore` complet (node_modules, .env, fichiers OS, IDE).
- Dépôt perso : https://github.com/leaspadea/sophie-bluel-portfolio
- Règle du projet : 1 commit par fonctionnalité, poussé régulièrement.

---

## Page de connexion (login)

### Page login.html
- Reprend header/footer de l'accueil. Formulaire : email + password (labels
  associés via for/id), bouton "Se connecter", `<p id="login-error">` pour
  l'erreur. Fichier JS dédié `assets/login.js` (un JS par page).

### Authentification (login.js)
- Contrat API vérifié (pas deviné) :
  - `POST http://localhost:5678/api/users/login` (⚠️ /api/**users**/login).
  - Envoi : `{ email, password }`. Succès 200 → `{ userId, token }`.
  - Erreurs : 401 (mauvais mdp), 404 (email inconnu).
- `event.preventDefault()` : empêche le rechargement auto du formulaire, c'est
  le JS qui gère.
- Requête POST : `method`, `headers` (Content-Type application/json),
  `body: JSON.stringify(...)` (objet JS → texte JSON pour l'envoi).
- `response.ok` (true si 200–299). Si ok → stocke le token, redirige.
- `localStorage.setItem("token", ...)` : garde le token entre les pages
  (une variable JS serait perdue au changement de page).
- Sécurité : même message d'erreur pour 401 et 404 (ne pas révéler si l'email
  existe). Débat connu sur token en localStorage (XSS) — hors scope ici.
- `window.location.href` : redirection vers l'accueil.

---

## Mode administrateur (accueil)

### Détection connexion + logout
- Nav : `<li>login</li>` remplacé par `<a href="./login.html" id="login-link">`
  (avant : texte brut non cliquable).
- `handleAuth()` : lit `localStorage.getItem("token")`. Si présent → connectée :
  le lien devient "logout", clic → `removeItem("token")` + redirection accueil.
- Appelée dans `init()`.

### Interface d'édition
- `displayAdminMode()` : crée un bandeau noir "Mode édition" (`document.body.prepend`)
  et masque les filtres (`filters.style.display = "none"`).
- Bandeau pleine largeur malgré `body { max-width:1140px }` : technique du
  "full-bleed" → `width:100vw; position:relative; left:50%; transform:translateX(-50%)`.
  (Effet de bord possible : scroll horizontal dû à la scrollbar → `overflow-x:hidden`.)

### Font Awesome
- CDN dans le `<head>` : `font-awesome/7.0.1/css/all.min.css`.
- Icône = police (glyphe), pas image. `fa-solid` toujours gratuit ;
  `fa-regular` limité en version gratuite (fallback : passer en `fa-solid`).

---

## À faire ensuite : la modale
- [ ] Bouton crayon "modifier" qui ouvre la modale.
- [ ] Vue galerie modale + suppression (DELETE /api/works/:id + token).
- [ ] Vue formulaire d'ajout (FormData, POST /api/works + token, aperçu image).
- [ ] Navigation entre vues, fermeture, rafraîchir sans recharger.
