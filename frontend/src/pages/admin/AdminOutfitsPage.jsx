import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const initialForm = {
  name: "",
  description: "",
  image: "",
  occasion: "casual",
  season: "all_season",
  style: "casual",
  genderTarget: "",
  products: []
};

export default function AdminOutfitsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [productResponse, outfitResponse] = await Promise.all([
        apiRequest("/products", { token }),
        apiRequest("/outfits", { token })
      ]);
      setProducts(productResponse.data);
      setOutfits(outfitResponse.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const buildPayload = () => ({
    ...form,
    products: form.products
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await apiRequest(`/outfits/${editingId}`, {
          method: "PUT",
          token,
          body: buildPayload()
        });
        setMessage("Outfit updated");
      } else {
        await apiRequest("/outfits", {
          method: "POST",
          token,
          body: buildPayload()
        });
        setMessage("Outfit created");
      }

      setForm(initialForm);
      setEditingId("");
      loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (outfit) => {
    setEditingId(outfit._id);
    setForm({
      name: outfit.name || "",
      description: outfit.description || "",
      image: outfit.image || "",
      occasion: outfit.occasion || "casual",
      season: outfit.season || "all_season",
      style: outfit.style || "casual",
      genderTarget: outfit.genderTarget || "",
      products: (outfit.products || []).map((item) => item._id || item)
    });
  };

  const toggleProductSelection = (productId) => {
    setForm((current) => ({
      ...current,
      products: current.products.includes(productId)
        ? current.products.filter((item) => item !== productId)
        : [...current.products, productId]
    }));
  };

  const handleDelete = async (outfitId) => {
    try {
      await apiRequest(`/outfits/${outfitId}`, {
        method: "DELETE",
        token
      });
      setMessage("Outfit deleted");
      loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const inputClass = "border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 transition-all text-[0.95rem] focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-full";
  const labelClass = "font-medium text-slate-700 text-[0.95rem] flex flex-col gap-2";

  return (
    <section className="grid gap-6">
      <AdminPageHeader title="Outfits" description="Curate outfit bundles and style edits." />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <form className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 grid gap-5 sticky top-6" onSubmit={handleSubmit}>
          <h3 className="text-slate-900 text-xl m-0 mb-2 pb-4 border-b border-slate-100 font-bold">{editingId ? "Edit outfit" : "New outfit"}</h3>
          <label className={labelClass}>
            Name
            <input className={inputClass} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label className={labelClass}>
            Description
            <textarea className={inputClass} rows="3" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <label className={labelClass}>
            Image URL
            <input className={inputClass} value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              Occasion
              <input className={inputClass} value={form.occasion} onChange={(event) => setForm((current) => ({ ...current, occasion: event.target.value }))} />
            </label>
            <label className={labelClass}>
              Season
              <input className={inputClass} value={form.season} onChange={(event) => setForm((current) => ({ ...current, season: event.target.value }))} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              Style
              <input className={inputClass} value={form.style} onChange={(event) => setForm((current) => ({ ...current, style: event.target.value }))} />
            </label>
            <label className={labelClass}>
              Gender target
              <input className={inputClass} value={form.genderTarget} onChange={(event) => setForm((current) => ({ ...current, genderTarget: event.target.value }))} />
            </label>
          </div>
          <label className={labelClass}>
            Selected products
            <div className="flex flex-wrap gap-2 mt-2">
              {form.products.length ? (
                form.products.map((productId) => {
                  const selectedProduct = products.find((product) => product._id === productId);

                  return (
                    <span key={productId} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium">
                      {selectedProduct?.name || productId}
                    </span>
                  );
                })
              ) : (
                <span className="text-slate-500 text-sm italic">No products selected yet</span>
              )}
            </div>
          </label>
          <div className="grid gap-2 max-h-48 overflow-y-auto p-4 border border-slate-200 rounded-xl bg-slate-50/50">
            {products.map((product) => (
              <label key={product._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  checked={form.products.includes(product._id)}
                  onChange={() => toggleProductSelection(product._id)}
                />
                <span className="text-slate-700 font-medium text-sm">
                  {product.name}
                  <small className="text-slate-500 ml-1">· {product.style}</small>
                </span>
              </label>
            ))}
          </div>
          {message ? <p className="text-green-600 font-medium m-0">{message}</p> : null}
          {error ? <p className="text-red-500 font-medium m-0">{error}</p> : null}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 border-none cursor-pointer transition-colors" type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId ? (
              <button type="button" className="px-6 py-3 rounded-xl font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => {
                setEditingId("");
                setForm(initialForm);
              }}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
          <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Outfit list</h3>
          <div className="grid gap-3">
            {outfits.map((outfit) => (
              <div key={outfit._id} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div>
                  <strong className="block text-slate-800 mb-1">{outfit.name}</strong>
                  <p className="m-0 text-sm text-slate-500">
                    {outfit.style} · {outfit.occasion}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors text-sm" onClick={() => handleEdit(outfit)}>
                    Edit
                  </button>
                  <button className="px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 border-none cursor-pointer transition-colors text-sm" onClick={() => handleDelete(outfit._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
