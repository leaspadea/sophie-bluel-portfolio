import { login } from "./api.js";

const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const response = await login(email, password);

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token);
    window.location.href = "./index.html";
  } else {
    document.querySelector("#login-error").textContent =
      "E-mail ou mot de passe incorrect.";
  }
});