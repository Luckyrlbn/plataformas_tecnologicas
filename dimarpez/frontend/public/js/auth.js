// public/js/auth.js
import { login, register } from '@services/api.js';
import { showToast } from './utils.js';

let authTab = "login";

export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch(e) {
    console.error("Error parsing user", e);
    return null;
  }
}

export function updateAuthButton() {
  const user = getCurrentUser();
  const btn = document.getElementById("openAuthBtn");
  if (!btn) {
    console.warn("Botón openAuthBtn no encontrado");
    return;
  }
  if (user) {
    btn.innerHTML = `👤 ${user.nombre || user.email || user.alias || 'Usuario'} ▼`;
    btn.onclick = () => {
      if (confirm("¿Cerrar sesión?")) {
        localStorage.removeItem("user");
        updateAuthButton();
        showToast("Sesión cerrada");
        location.reload();
      }
    };
  } else {
    btn.innerHTML = "Ingresar";
    btn.onclick = () => openAuth();
  }
  console.log("Botón actualizado, user:", user);
}

export function openAuth() {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.style.display = "flex";
  switchAuthTab("login");
  // Limpiar campos
  ["authEmail","authPassword","regNombre","regEmail","regPassword","regDireccion","regMetodoPago","regAlias"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  const err = document.getElementById("authError");
  if (err) err.style.display = "none";
}

export function closeAuth() {
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "none";
}

export function switchAuthTab(tab) {
  authTab = tab;
  const isRegister = tab === "register";
  const title = document.getElementById("authTitle");
  const sub = document.getElementById("authSub");
  if (title) title.textContent = isRegister ? "Crear cuenta" : "Bienvenido de nuevo";
  if (sub) sub.textContent = isRegister ? "Regístrate con email y contraseña" : "Ingresa tu email y contraseña";
  
  const loginDiv = document.getElementById("loginFields");
  const registerDiv = document.getElementById("registerFields");
  if (loginDiv) loginDiv.style.display = isRegister ? "none" : "block";
  if (registerDiv) registerDiv.style.display = isRegister ? "block" : "none";
  
  const btn = document.getElementById("authBtn");
  if (btn) btn.textContent = isRegister ? "Crear cuenta" : "Ingresar";
  const err = document.getElementById("authError");
  if (err) err.style.display = "none";
  
  document.querySelectorAll(".auth-tab").forEach(el => {
    el.classList.toggle("on", el.dataset.authTab === tab);
  });
}

export async function handleAuth() {
  const errEl = document.getElementById("authError");
  if (!errEl) return;
  errEl.style.display = "none";
  
  if (authTab === "register") {
    const nombre = document.getElementById("regNombre")?.value.trim();
    const email = document.getElementById("regEmail")?.value.trim();
    const password = document.getElementById("regPassword")?.value;
    const direccion = document.getElementById("regDireccion")?.value.trim();
    const metodoPago = document.getElementById("regMetodoPago")?.value;
    const alias = document.getElementById("regAlias")?.value.trim() || "";
    
    if (!nombre || !email || !password || !direccion || !metodoPago) {
      errEl.textContent = "⚠️ Todos los campos son obligatorios.";
      errEl.style.display = "block";
      return;
    }
    if (!email.includes('@')) {
      errEl.textContent = "⚠️ Email inválido.";
      errEl.style.display = "block";
      return;
    }
    try {
      await register({ nombre, email, password, direccion, metodoPago, alias });
      showToast("✓ Cuenta creada. Ahora inicia sesión.");
      switchAuthTab("login");
      const authEmail = document.getElementById("authEmail");
      if (authEmail) authEmail.value = email;
      const authPassword = document.getElementById("authPassword");
      if (authPassword) authPassword.value = "";
    } catch (error) {
      errEl.textContent = "❌ Error al registrar: " + error.message;
      errEl.style.display = "block";
    }
  } else {
    const email = document.getElementById("authEmail")?.value.trim();
    const password = document.getElementById("authPassword")?.value;
    if (!email || !password) {
      errEl.textContent = "⚠️ Ingresa email y contraseña.";
      errEl.style.display = "block";
      return;
    }
    try {
      const data = await login(email, password);
      // Asegurar que data tenga al menos un campo 'nombre' o 'email'
      localStorage.setItem("user", JSON.stringify(data));
      showToast(`👋 Bienvenido ${data.nombre || data.email || email}`);
      closeAuth();
      updateAuthButton();  // Esto debería cambiar el botón
      // Recargar para refrescar estado
      location.reload();
    } catch (error) {
      errEl.textContent = "❌ " + error.message;
      errEl.style.display = "block";
    }
  }
}