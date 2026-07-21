import { getWorks, getCategories } from "./api.js";
import { store } from "./store.js";
import { displayWorks, displayFilters } from "./gallery.js";
import { openModal, closeModal } from "./modal.js";

// Active l'interface admin : bandeau, bouton "modifier", ouverture/fermeture de la modale.
function displayAdminMode() {
    const banner = document.createElement("div");
    banner.classList.add("edit-banner");
    banner.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Mode édition';
    document.body.prepend(banner);

    const filters = document.querySelector(".filters");
    filters.style.display = "none";

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
function handleAuth() {
    const token = localStorage.getItem("token");
    const loginLink = document.querySelector("#login-link");

    if (token) {
        loginLink.textContent = "logout";
        displayAdminMode();

        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "./index.html";
        });
    }
}

// Point d'entrée : récupère les données de l'API et construit la page.
async function init() {
    store.works = await getWorks();
    displayWorks(store.works);

    store.categories = await getCategories();
    displayFilters(store.categories);

    handleAuth();
}

init();
