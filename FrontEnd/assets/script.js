
import { getWorks, getCategories, addWork, deleteWork } from "./api.js";
import { store } from "./store.js";

// Affiche une liste de travaux dans la galerie de l'accueil.
function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    works.forEach((work) => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    });
}

// Génère les boutons de filtre et gère le filtrage au clic.
function displayFilters(categories) {
    const filtersContainer = document.querySelector(".filters");

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.classList.add("filter-btn");
    allButton.dataset.categoryId = "0";
    allButton.classList.add("filter-btn", "active");
    filtersContainer.appendChild(allButton);

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.classList.add("filter-btn");
        button.dataset.categoryId = category.id;
        filtersContainer.appendChild(button);
    });

    const buttons = filtersContainer.querySelectorAll(".filter-btn");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {

            buttons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            
            const categoryId = Number(button.dataset.categoryId);

            if (categoryId === 0) {
                displayWorks(store.works);
            } else {
                const filteredWorks = store.works.filter((work) => work.categoryId === categoryId);
                displayWorks(filteredWorks);
            }
        });
    });
}

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

// Ouvre la modale sur la vue galerie.
function openModal() {
    const modal = document.querySelector("#modal");
    modal.setAttribute("aria-hidden", "false");
    displayModalGallery();
}

// Ferme la modale.
function closeModal() {
    const modal = document.querySelector("#modal");
    modal.setAttribute("aria-hidden", "true");
}

// Affiche la 1re vue de la modale : la galerie avec les corbeilles de suppression.
function displayModalGallery() {
    const modalContent = document.querySelector(".modal-content");
    modalContent.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = "Galerie photo";
    modalContent.appendChild(title);

    const gallery = document.createElement("div");
    gallery.classList.add("modal-gallery");

    store.works.forEach((work) => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        trashIcon.dataset.id = work.id;

        figure.appendChild(img);
        figure.appendChild(trashIcon);
        gallery.appendChild(figure);

        trashIcon.addEventListener("click", (event) => {
            event.preventDefault();
            handleDeleteWork(work.id);
        });
    });

    modalContent.appendChild(gallery);

    // Ligne verte de séparation entre la galerie et le bouton.
    const separator = document.createElement("hr");
    separator.classList.add("modal-separator");
    modalContent.appendChild(separator);

    // Bouton "Ajouter une photo", en dernier.
    const addButton = document.createElement("button");
    addButton.textContent = "Ajouter une photo";
    addButton.classList.add("add-photo-button");
    addButton.addEventListener("click", displayAddPhotoView);
    modalContent.appendChild(addButton);
}

// Affiche la 2e vue de la modale : le formulaire d'ajout d'un projet.
function displayAddPhotoView() {
    const modalContent = document.querySelector(".modal-content");
    modalContent.innerHTML = "";

    // Flèche de retour vers la galerie.
    const backArrow = document.createElement("i");
    backArrow.classList.add("fa-solid", "fa-arrow-left", "modal-back");
    backArrow.addEventListener("click", displayModalGallery);
    modalContent.appendChild(backArrow);

    // Titre de la vue.
    const title = document.createElement("h3");
    title.textContent = "Ajouter photo";
    modalContent.appendChild(title);

    modalContent.appendChild(createAddPhotoForm());
}

// Construit le formulaire d'ajout (zone image + titre + catégorie + bouton).
function createAddPhotoForm() {
    const form = document.createElement("form");
    form.classList.add("add-photo-form");

    // Champs du formulaire (chacun construit par une fonction dédiée).
    const { uploadZone, fileInput } = createImageUploadZone();
    const { titleLabel, titleInput } = createTextField("Titre", "title");
    const categoryLabel = createLabel("Catégorie", "category");
    const categorySelect = createCategorySelect();
    const submitButton = createSubmitButton();

    form.append(uploadZone, titleLabel, titleInput, categoryLabel, categorySelect, submitButton);

    // Le bouton devient vert quand les 3 champs sont remplis.
    const refreshButtonState = () => {
        const isComplete =
            fileInput.files[0] && titleInput.value !== "" && categorySelect.value !== "";
        submitButton.classList.toggle("active", Boolean(isComplete));
    };
    fileInput.addEventListener("change", refreshButtonState);
    titleInput.addEventListener("input", refreshButtonState);
    categorySelect.addEventListener("change", refreshButtonState);

    // Envoi du formulaire.
    form.addEventListener("submit", (event) =>
        handleAddWork(event, fileInput, titleInput, categorySelect)
    );

    return form;
}

// Crée la zone d'upload : icône + bouton, et gère l'aperçu de l'image choisie.
function createImageUploadZone() {
    const uploadZone = document.createElement("div");
    uploadZone.classList.add("upload-zone");

    const icon = document.createElement("i");
    icon.classList.add("fa-regular", "fa-image");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "image";
    fileInput.name = "image";
    fileInput.accept = "image/png, image/jpeg";

    const fileLabel = document.createElement("label");
    fileLabel.setAttribute("for", "image");
    fileLabel.classList.add("upload-label");
    fileLabel.textContent = "+ Ajouter photo";

    uploadZone.append(icon, fileLabel, fileInput);

    // Aperçu dès qu'un fichier est sélectionné.
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const oldPreview = uploadZone.querySelector(".upload-preview");
        if (oldPreview) oldPreview.remove();

        const preview = document.createElement("img");
        preview.src = URL.createObjectURL(file);
        preview.alt = "Aperçu de l'image";
        preview.classList.add("upload-preview");
        uploadZone.appendChild(preview);

        icon.style.display = "none";
        fileLabel.style.display = "none";
    });

    return { uploadZone, fileInput };
}

// Crée un label seul (utilisé pour la catégorie).
function createLabel(text, forId) {
    const label = document.createElement("label");
    label.setAttribute("for", forId);
    label.textContent = text;
    return label;
}

// Crée un couple label + champ texte.
function createTextField(labelText, id) {
    const titleLabel = createLabel(labelText, id);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = id;
    titleInput.name = id;

    return { titleLabel, titleInput };
}

// Crée la liste déroulante des catégories (remplie depuis l'API).
function createCategorySelect() {
    const categorySelect = document.createElement("select");
    categorySelect.id = "category";
    categorySelect.name = "category";

    // Option vide au départ pour ne rien présélectionner.
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    categorySelect.appendChild(emptyOption);

    store.categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    return categorySelect;
}

// Crée le bouton de validation du formulaire.
function createSubmitButton() {
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Valider";
    submitButton.classList.add("validate-button");
    return submitButton;
}

// Valide, envoie le formulaire à l'API, puis met à jour l'affichage sans recharger.
async function handleAddWork(event, fileInput, titleInput, categorySelect) {
    event.preventDefault();

    const file = fileInput.files[0];
    const titleValue = titleInput.value;
    const categoryValue = categorySelect.value;

    // Les 3 champs doivent être remplis.
    if (!file || titleValue === "" || categoryValue === "") {
        alert("Merci de remplir tous les champs.");
        return;
    }

    // Corps multipart (image + texte).
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", titleValue);
    formData.append("category", categoryValue);

    const response = await addWork(formData);

    if (response.ok) {
        const newWork = await response.json();
        store.works.push(newWork);   // mise à jour de l'état
        displayWorks(store.works);   // mise à jour du portfolio
        displayModalGallery();    // mise à jour de la galerie modale
    } else {
        alert("Erreur lors de l'ajout du projet.");
    }
}

// Supprime un travail via l'API, puis met à jour l'affichage sans recharger.
async function handleDeleteWork(id) {
    const response = await deleteWork(id);

    if (response.ok) {
        store.works = store.works.filter((work) => work.id !== id);
        displayModalGallery();
        displayWorks(store.works);
    } else {
        alert("Erreur lors de la suppression.");
    }
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