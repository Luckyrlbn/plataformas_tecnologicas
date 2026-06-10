import { showToast } from './utils.js';

let authTab = "login";

export function openAuth() {
  document.getElementById("authModal").style.display = "flex";
  switchAuthTab("login");
}

export function closeAuth() {
  document.getElementById("authModal").style.display = "none";
}

export function switchAuthTab(tab) {
  authTab = tab;
  const isRegister = tab === "register";
  document.getElementById("authTitle").textContent = isRegister ? "Crear cuenta" : "Bienvenido de nuevo";
  document.getElementById("authSub").textContent = isRegister ? "Regístrate para una experiencia más rápida." : "Ingresa para ver tus pedidos y guardar tu información.";
  document.getElementById("registerFields").style.display = isRegister ? "block" : "none";
  document.getElementById("registerExtra").style.display = isRegister ? "block" : "none";
  document.getElementById("authBtn").textContent = isRegister ? "Crear cuenta" : "Ingresar";
  document.getElementById("authError").style.display = "none";
  document.querySelectorAll(".auth-tab").forEach(el => {
    el.classList.toggle("on", el.dataset.authTab === tab);
  });
}

export function handleAuth() {
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  const errEl = document.getElementById("authError");
  if (!email || !password) {
    errEl.textContent = "⚠️ Completa los campos obligatorios.";
    errEl.style.display = "block";
    return;
  }
  if (authTab === "register") {
    const name = document.getElementById("regName").value.trim();
    if (!name) { errEl.textContent = "⚠️ El nombre es obligatorio."; errEl.style.display = "block"; return; }
  }
  closeAuth();
  showToast(authTab === "login" ? "👋 Bienvenido" : "✓ Cuenta creada");
}