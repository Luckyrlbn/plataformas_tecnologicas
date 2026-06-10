// src/services/api.js
const API_BASE = '/api';

export const WEIGHT_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];

// Cambia "productos" por "producto" (singular)
export async function fetchProducts() {
  const response = await fetch(`${API_BASE}/producto`);
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  const data = await response.json();
  // Mapea los campos si tu modelo Producto tiene nombres diferentes
  return data.map(p => ({
    id: p.id,
    nombre: p.nombre,
    emoji: p.emoji || "🐟",        // Si no viene, asigna por defecto
    categoria: p.categoria,
    descripcion: p.descripcion || "Producto fresco",
    precio: p.precio,
    stock: p.stock,
    unidad: p.unidad || "kg",
    activo: p.activo !== undefined ? p.activo : true
  }));
}

// Para crear pedido (si tienes endpoint)
export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) throw new Error('Error al crear pedido');
  return response.json();
}

// Autenticación (si la tienes)
export async function login(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

export async function register(userData) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}