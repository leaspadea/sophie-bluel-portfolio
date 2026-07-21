// ============================================================
//  auth.js — Connexion et interface d'administration
//  Détecte si l'utilisatrice est connectée (token) et adapte
//  l'affichage de la page d'accueil en conséquence.
// ============================================================

import { openModal, closeModal } from "./modal.js";

// Active l'interface admin : bandeau, bouton "modifier", ouverture/fermeture de la modale.
function displayAdminMode() {
    // Bandeau noir "Mode édition" en haut de la page.
    const banner = document.createElement("div");
    banner.classList.add("edit-banner");
    banner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
    document.body.prepend(banner);

    // Les filtres n'ont pas de sens en mode gestion.
    const filters = document.querySelector(".filters");
    filters.style.display = "none";

    // Lien "modifier" à côté du titre "Mes Projets".
    const portfolioTitle = document.querySelector("#portfolio h2");

    const editLink = document.createElement("a");
    editLink.href = "#";
    editLink.classList.add("edit-link");
    editLink.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> modifier';

    editLink.addEventListener("click", (event) => {
        event.preventDefault();
        openModal();
    });

    const modal = document.querySelector("#modal");
    const closeButton = modal.querySelector(".modal-close");

    // Trois façons de fermer : la croix, le clic sur le voile, la touche Échap.
    closeButton.addEventListener("click", closeModal);

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    portfolioTitle.after(editLink);
}

// Adapte l'affichage selon la connexion (mode admin si un token est présent).
export function handleAuth() {
    const token = localStorage.getItem("token");
    const loginLink = document.querySelector("#login-link");

    if (token) {
        // Connectée : "login" devient "logout" et l'interface admin s'active.
        loginLink.textContent = "logout";
        displayAdminMode();

        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("token"); // se déconnecter = jeter le token
            window.location.href = "./index.html";
        });
    }
}
