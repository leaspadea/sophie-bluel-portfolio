// ============================================================
//  api.js — Couche d'accès aux données (dialogue avec l'API)
//  Regroupe tous les appels réseau (fetch) du projet.
// ============================================================

const API_URL = "http://localhost:5678/api";

// Construit l'en-tête d'autorisation avec le token stocké à la connexion.
function getAuthHeader() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

// Récupère la liste des travaux. Renvoie un tableau d'objets.
export async function getWorks() {
    const response = await fetch(`${API_URL}/works`);
    return response.json();
}

// Récupère la liste des catégories. Renvoie un tableau d'objets.
export async function getCategories() {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
}

// Envoie les identifiants de connexion. Renvoie la réponse brute (pour tester response.ok).
export async function login(email, password) {
    return fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
}

// Ajoute un travail (image + titre + catégorie via FormData). Renvoie la réponse brute.
export async function addWork(formData) {
    return fetch(`${API_URL}/works`, {
        method: "POST",
        headers: getAuthHeader(),
        body: formData,
    });
}

// Supprime un travail par son id. Renvoie la réponse brute.
export async function deleteWork(id) {
    return fetch(`${API_URL}/works/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
    });
}
