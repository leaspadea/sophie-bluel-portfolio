// ============================================================
//  store.js — État partagé de l'application
//  Les autres modules importent cet objet pour lire et mettre à
//  jour les données. On modifie ses PROPRIÉTÉS (store.works = ...),
//  jamais l'objet lui-même : c'est ce qui permet de partager le
//  même état entre tous les fichiers.
// ============================================================

export const store = {
    works: [],      // tous les travaux récupérés depuis l'API
    categories: [], // toutes les catégories récupérées depuis l'API
};
