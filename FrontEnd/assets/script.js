
let allWorks = [];

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

async function init() {
    allWorks = await fetchWorks();
    displayWorks(allWorks);

    const categories = await fetchCategories();
    displayFilters(categories);
}

init();