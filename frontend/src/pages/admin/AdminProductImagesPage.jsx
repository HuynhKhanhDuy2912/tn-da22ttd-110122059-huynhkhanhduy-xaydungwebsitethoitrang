import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const initialForm = {
  productId: "",
  imageUrl: "",
  isMain: false
};

export default function AdminProductImagesPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [productResponse, imageResponse] = await Promise.all([
        apiRequest("/products", { token }),
        apiRequest("/product-images", { token })
      ]);
      setProducts(productResponse.data);
      setImages(imageResponse.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await apiRequest(`/product-images/${editingId}`, {
          method: "PUT",
          token,
          body: form
        });
        setMessage("Product image updated");
      } else {
        await apiRequest("/product-images", {
          method: "POST",
          token,
          body: form
        });
        setMessage("Product image created");
      }

      setForm(initialForm);
      setEditingId("");
      loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (image) => {
    setEditingId(image._id);
    setForm({
      productId: image.productId?._id || "",
      imageUrl: image.imageUrl || "",
      isMain: Boolean(image.isMain)
    });
  };

  const handleDelete = async (imageId) => {
    try {
      await apiRequest(`/product-images/${imageId}`, {
        method: "DELETE",
        token
      });
      setMessage("Product image deleted");
      loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const inputClass = "border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 transition-all text-[0.95rem] focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-full";
  const labelClass = "font-medium text-slate-700 text-[0.95rem] flex flex-col gap-2";

  return (
    <section className="grid gap-6">
      <AdminPageHeader
        title="Product Images"
        description="Manage supplemental image records for products."
      />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <form className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 grid gap-5 sticky top-6" onSubmit={handleSubmit}>
          <h3 className="text-slate-900 text-xl m-0 mb-2 pb-4 border-b border-slate-100 font-bold">{editingId ? "Edit image" : "New image"}</h3>
          <label className={labelClass}>
            Product
            <select
              className={inputClass}
              value={form.productId}
              onChange={(event) =>
                setForm((current) => ({ ...current, productId: event.target.value }))
              }
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Image URL
            <input
              className={inputClass}
              value={form.imageUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, imageUrl: event.target.value }))
              }
            />
          </label>
          <label className="flex items-center gap-3 cursor-pointer py-2 text-slate-700 font-medium">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
              checked={form.isMain}
              onChange={(event) =>
                setForm((current) => ({ ...current, isMain: event.target.checked }))
              }
            />
            <span>Mark as main image</span>
          </label>
          {message ? <p className="text-green-600 font-medium m-0">{message}</p> : null}
          {error ? <p className="text-red-500 font-medium m-0">{error}</p> : null}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 border-none cursor-pointer transition-colors" type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId ? (
              <button
                type="button"
                className="px-6 py-3 rounded-xl font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => {
                  setEditingId("");
                  setForm(initialForm);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
          <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Image list</h3>
          <div className="grid gap-3">
            {images.map((image) => (
              <div key={image._id} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                    {image.imageUrl ? <img src={image.imageUrl} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div>
                    <strong className="block text-slate-800 mb-1">{image.productId?.name}</strong>
                    <p className="m-0 text-sm text-slate-500 max-w-[200px] truncate" title={image.imageUrl}>{image.imageUrl}</p>
                    <p className="m-0 text-xs font-bold mt-1 text-blue-600">{image.isMain ? "★ Main image" : "Secondary image"}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors text-sm" onClick={() => handleEdit(image)}>
                    Edit
                  </button>
                  <button className="px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 border-none cursor-pointer transition-colors text-sm" onClick={() => handleDelete(image._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
