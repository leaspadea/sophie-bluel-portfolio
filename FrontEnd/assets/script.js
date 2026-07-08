
let allWorks = [];
let allCategories = [];

async function fetchWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
}

async function fetchCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    return categories;
}

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
                displayWorks(allWorks);
            } else {
                const filteredWorks = allWorks.filter((work) => work.categoryId === categoryId);
                displayWorks(filteredWorks);
            }
        });
    });
}

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

function openModal() {
    const modal = document.querySelector("#modal");
    modal.setAttribute("aria-hidden", "false");
    displayModalGallery();
}

function closeModal() {
    const modal = document.querySelector("#modal");
    modal.setAttribute("aria-hidden", "true");
}

function displayModalGallery() {
    const modalContent = document.querySelector(".modal-content");
    modalContent.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = "Galerie photo";
    modalContent.appendChild(title);

    const gallery = document.createElement("div");
    gallery.classList.add("modal-gallery");

    allWorks.forEach((work) => {
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
            deleteWork(work.id);
        });
    });

    const addButton = document.createElement("button");
    addButton.textContent = "Ajouter une photo";
    addButton.classList.add("add-photo-button");
    addButton.addEventListener("click", displayAddPhotoView);
    modalContent.appendChild(addButton);


    modalContent.appendChild(gallery);
}

function displayAddPhotoView() {
    const modalContent = document.querySelector(".modal-content");
    modalContent.innerHTML = "";

    const backArrow = document.createElement("i");
    backArrow.classList.add("fa-solid", "fa-arrow-left", "modal-back");
    backArrow.addEventListener("click", displayModalGallery);
    modalContent.appendChild(backArrow);

    const title = document.createElement("h3");
    title.textContent = "Ajouter photo";
    modalContent.appendChild(title);

    const form = document.createElement("form");
    form.classList.add("add-photo-form");

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

    uploadZone.appendChild(icon);
    uploadZone.appendChild(fileLabel);
    uploadZone.appendChild(fileInput);

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

    const titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", "title");
    titleLabel.textContent = "Titre";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title";
    titleInput.name = "title";

    const categoryLabel = document.createElement("label");
    categoryLabel.setAttribute("for", "category");
    categoryLabel.textContent = "Catégorie";

    const categorySelect = document.createElement("select");
    categorySelect.id = "category";
    categorySelect.name = "category";

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    categorySelect.appendChild(emptyOption);

    allCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Valider";
    submitButton.classList.add("validate-button");

    form.appendChild(uploadZone);
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(categoryLabel);
    form.appendChild(categorySelect);
    form.appendChild(submitButton);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const file = fileInput.files[0];
        const titleValue = titleInput.value;
        const categoryValue = categorySelect.value;

        if (!file || titleValue === "" || categoryValue === "") {
            alert("Merci de remplir tous les champs.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", titleValue);
        formData.append("category", categoryValue);

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const newWork = await response.json();
            allWorks.push(newWork);
            displayWorks(allWorks);
            closeModal();
        } else {
            alert("Erreur lors de l'ajout du projet.");
        }
    });

    function updateSubmitButton() {
        const isComplete =
            fileInput.files[0] &&
            titleInput.value !== "" &&
            categorySelect.value !== "";

        if (isComplete) {
            submitButton.classList.add("active");
        } else {
            submitButton.classList.remove("active");
        }
    }

    fileInput.addEventListener("change", updateSubmitButton);
    titleInput.addEventListener("input", updateSubmitButton);
    categorySelect.addEventListener("change", updateSubmitButton);

    modalContent.appendChild(form);
}

async function deleteWork(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.ok) {
        allWorks = allWorks.filter((work) => work.id !== id);
        displayModalGallery();
        displayWorks(allWorks);
    } else {
        alert("Erreur lors de la suppression.");
    }
}

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

async function init() {
    allWorks = await fetchWorks();
    displayWorks(allWorks);

    allCategories = await fetchCategories();
    displayFilters(allCategories);

    handleAuth();
}

init();