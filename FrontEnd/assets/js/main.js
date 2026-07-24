// ============================================================
//  main.js — Point d'entrée de la page d'accueil
//  Récupère les données de l'API, construit la page, puis active
//  l'interface d'administration si l'utilisatrice est connectée.
// ============================================================

import { getWorks, getCategories } from "./api.js";
import { store } from "./store.js";
import { displayWorks, displayFilters } from "./gallery.js";
import { handleAuth } from "./admin.js";

async function init() {
    // 1. Les travaux : on les stocke puis on les affiche.
    store.works = await getWorks();
    displayWorks(store.works);

    // 2. Les catégories : on les stocke puis on génère les filtres.
    store.categories = await getCategories();
    displayFilters(store.categories);

    // 3. Mode admin si un token est présent.
    handleAuth();
}

init();
