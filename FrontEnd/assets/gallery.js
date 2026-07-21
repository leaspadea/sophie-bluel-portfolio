// ============================================================
//  gallery.js — Affichage de la galerie et des filtres (accueil)
// ============================================================

import { store } from "./store.js";

// Affiche une liste de travaux dans la galerie de l'accueil.
export function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; // on vide avant de reconstruire

    works.forEach((work) => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.append(img, figcaption);
        gallery.appendChild(figure);
    });
}

// Génère les boutons de filtre et gère le filtrage au clic.
export function displayFilters(categories) {
    const filtersContainer = document.querySelector(".filters");

    // Bouton "Tous" : ajouté à la main (absent de l'API), actif par défaut.
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-btn", "active");
    allButton.dataset.categoryId = "0";
    filtersContainer.appendChild(allButton);

    // Un bouton par catégorie renvoyée par l'API.
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.classList.add("filter-btn");
        button.dataset.categoryId = category.id;
        filtersContainer.appendChild(button);
    });

    // Au clic : un seul bouton actif, puis affichage de la sélection.
    const buttons = filtersContainer.querySelectorAll(".filter-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const categoryId = Number(button.dataset.categoryId);

            if (categoryId === 0) {
                displayWorks(store.works);
            } else {
                const filteredWorks = store.works.filter(
                    (work) => work.categoryId === categoryId
                );
                displayWorks(filteredWorks);
            }
        });
    });
}
