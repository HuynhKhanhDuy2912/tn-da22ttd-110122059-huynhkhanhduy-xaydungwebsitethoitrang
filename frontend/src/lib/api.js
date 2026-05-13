const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  const normalizedMethod = method.toUpperCase();
  const changesCart =
    (path.startsWith("/carts/me/items") && ["POST", "PUT", "PATCH", "DELETE"].includes(normalizedMethod)) ||
    (path === "/carts/me" && ["DELETE"].includes(normalizedMethod)) ||
    (path === "/orders/checkout" && normalizedMethod === "POST");

  if (changesCart && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cart:changed"));
  }

  return data;
}
