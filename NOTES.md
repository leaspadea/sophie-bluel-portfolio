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

## La modale

### Ouverture / fermeture
- Lien "modifier" créé en JS (mode admin), `portfolioTitle.after(editLink)`.
- Squelette `<aside id="modal">` dans le HTML, caché par défaut.
  Affichage piloté par l'attribut `aria-hidden` (true/false) + CSS
  (`.modal[aria-hidden="false"] { display:flex }`) → gère affichage ET accessibilité.
- Fermeture : croix, clic sur le voile (`event.target === modal`), touche Échap.
- Notion : `event.target` (élément cliqué) vs `event.currentTarget` (porteur
  de l'écouteur) → distinguer clic "voile" vs clic "dans la boîte".

### Vue galerie + suppression
- `displayModalGallery()` : miniatures depuis `allWorks` + corbeille par projet
  (`data-id`). Piège rencontré : bouton "Ajouter" doit être HORS du forEach.
- `deleteWork(id)` : `DELETE /api/works/:id` + header `Authorization: Bearer <token>`.
  Puis `allWorks.filter(...)` et réaffichage des 2 galeries → maj sans recharger.

### Vue ajout (formulaire)
- Navigation entre vues = réutiliser des fonctions (passer `displayAddPhotoView`
  SANS parenthèses à addEventListener).
- Champ fichier caché + `<label for>` stylé = "faux bouton" d'upload.
- `<select>` catégories rempli depuis `allCategories` (stocké comme `allWorks`).
- Aperçu image : événement `change`, `fileInput.files[0]`, `URL.createObjectURL(file)`.

### Envoi (POST)
- Contrat vérifié : `POST /api/works`, champs `image` / `title` / `category`,
  réponse 201. Route protégée (token).
- `FormData` (multipart) pour envoyer un FICHIER (JSON ne peut pas).
- ⚠️ NE PAS définir `Content-Type` : le navigateur ajoute la "boundary" multipart
  automatiquement ; le fixer à la main casse l'upload. Garder juste `Authorization`.
- Succès → `allWorks.push(newWork)`, `displayWorks`, `closeModal` (maj sans recharger).

---

## Finitions style + navigation
- Bouton "Valider" du formulaire d'ajout : vert quand les 3 champs remplis
  (événements `input`/`change`, toggle de classe).
- Filtres : état "sélectionné" unique (retirer `active` de tous, l'ajouter au
  cliqué) ; "Tous" actif par défaut. Style pilule vert plein / transparent.
- Footer pleine largeur malgré `body { max-width:1140px }` : full-bleed
  (`100vw` + `left:50%` + `transform:translateX(-50%)`) + `html{overflow-x:hidden}`
  (sur html, PAS body, sinon le footer serait rogné). Texte aligné sur la zone
  de contenu via `padding: 0 max(20px, calc((100vw-1140px)/2))` + `box-sizing:border-box`.
- Footer collant sur page login courte : `body{display:flex;flex-direction:column;
  min-height:100vh}` + `main{flex:1}`.
- Nav : "projets"/"contact" = ancres (`#portfolio`/`#contact` sur l'accueil,
  `./index.html#...` depuis le login). Page active en gras (classe `.active-page`).
  Logo `<h1>` cliquable → accueil (`<a>` dans le h1, `color:inherit`).
- Piège appris : envelopper du contenu dans une balise change la hiérarchie DOM
  → casse les sélecteurs `>` (enfant direct → passer en descendant) et les
  layouts flex définis sur le parent.

---

## Finalisation de la modale
- Étape OC 8.2 : après un ajout, `displayModalGallery()` (au lieu de `closeModal()`)
  → la nouvelle image apparaît dans le portfolio ET dans la galerie de la modale,
  sans rechargement. Cohérent avec la suppression.
- Ligne de séparation générée en JS (`<hr class="modal-separator">`).
- Format modale responsive : `aspect-ratio: 630 / 688` + `max-width: 630px`
  (proportion de la maquette sans taille figée).
- Galerie à 66,66 % de la modale malgré le padding du wrapper : `calc(66.66% + 40px)`
  (le +40px = 2/3 du padding total 60px, pour compenser la zone rognée en border-box).
  Même formule sur `.modal-separator` pour l'aligner sur la galerie.
- `column-gap` ≠ `row-gap` (écart vertical > horizontal).

---

## À faire ensuite
- [ ] Validation W3C (HTML + CSS).
- [ ] Test responsive + Chrome/Firefox.
- [ ] README.md.
- [ ] Question du déploiement (backend Node → pas GitHub Pages seul).
