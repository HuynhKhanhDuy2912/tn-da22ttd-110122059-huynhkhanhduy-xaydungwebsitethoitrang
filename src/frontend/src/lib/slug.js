export function createSlug(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProductPath(product, query = {}) {
  const slug = createSlug(product?.name || "san-pham");
  const id = product?._id;
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const search = params.toString();
  return `/products/${id ? `${slug}-${id}` : slug}${search ? `?${search}` : ""}`;
}
