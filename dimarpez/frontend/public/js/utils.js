// utils.js
export const formatCOP = (n) => `$${Number(n).toLocaleString("es-CO")}`;

let toastTimeout = null;
export function showToast(msg, isError = false) {
  const toast = document.getElementById("toastEl");
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast${isError ? " err" : ""}`;
  toast.style.display = "block";
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.style.display = "none"; }, 2500);
}