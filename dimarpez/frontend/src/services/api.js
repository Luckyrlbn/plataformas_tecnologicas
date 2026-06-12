// src/services/api.js
const API_BASE = '/api';

export const WEIGHT_OPTIONS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5];

export async function fetchProducts() {
  const response = await fetch(`${API_BASE}/producto`);
  if (!response.ok) throw new Error('Error al cargar productos');
  return response.json();
}

export async function register(userData) {
  const response = await fetch(`${API_BASE}/perfiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: userData.nombre,
      email: userData.email,
      contraseña: userData.password,
      direccion: userData.direccion,
      metodoPago: userData.metodoPago,
      alias: userData.alias || '',
      rol: 'cliente'
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error al registrar');
  }
  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/perfiles/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error de login');
  }
  return response.json();
}


export async function createOrder(orderData) {
  const response = await fetch(`${API_BASE}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  if (!response.ok) throw new Error('Error al crear pedido');
  return response.json();
}


