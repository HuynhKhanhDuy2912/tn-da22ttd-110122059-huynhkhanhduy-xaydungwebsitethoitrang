import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const initialForm = {
  productId: "",
  size: "",
  color: "",
  sku: "",
  stock: 0,
  priceAdjustment: 0,
  image: ""
};

export default function AdminVariantsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [productResponse, variantResponse] = await Promise.all([
        apiRequest("/products", { token }),
        apiRequest("/product-variants", { token })
      ]);
      setProducts(productResponse.data);
      setVariants(variantResponse.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...form,
        stock: Number(form.stock),
        priceAdjustment: Number(form.priceAdjustment)
      };

      if (editingId) {
        await apiRequest(`/product-variants/${editingId}`, {
          method: "PUT",
          token,
          body: payload
        });
        setMessage("Đã cập nhật biến thể");
      } else {
        await apiRequest("/product-variants", {
          method: "POST",
          token,
          body: payload
        });
        setMessage("Đã thêm biến thể");
      }

      setForm(initialForm);
      setEditingId("");
      loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (variant) => {
    setEditingId(variant._id);
    setForm({
      productId: variant.productId?._id || "",
      size: variant.size || "",
      color: variant.color || "",
      sku: variant.sku || "",
      stock: variant.stock || 0,
      priceAdjustment: variant.priceAdjustment || 0,
      image: variant.image || ""
    });
  };

  const handleDelete = async (variantId) => {
    try {
      await apiRequest(`/product-variants/${variantId}`, {
        method: "DELETE",
        token
      });
      setMessage("Đã xóa biến thể");
      loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const inputClass = "border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 transition-all text-[0.95rem] focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-full";
  const labelClass = "font-medium text-slate-700 text-[0.95rem] flex flex-col gap-2";

  return (
    <section className="grid gap-6">
      <AdminPageHeader title="Biến thể" description="Quản lý màu sắc, kích cỡ, tồn kho và mã SKU." />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <form className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 grid gap-5 sticky top-6" onSubmit={handleSubmit}>
          <h3 className="text-slate-900 text-xl m-0 mb-2 pb-4 border-b border-slate-100 font-bold">{editingId ? "Sửa biến thể" : "Thêm biến thể mới"}</h3>
          <label className={labelClass}>
            Sản phẩm
            <select
              className={inputClass}
              value={form.productId}
              onChange={(event) =>
                setForm((current) => ({ ...current, productId: event.target.value }))
              }
            >
              <option value="">Chọn sản phẩm</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              Kích cỡ
              <input className={inputClass} value={form.size} onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))} />
            </label>
            <label className={labelClass}>
              Màu sắc
              <input className={inputClass} value={form.color} onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))} />
            </label>
          </div>
          <label className={labelClass}>
            Mã SKU
            <input className={inputClass} value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              Tồn kho
              <input className={inputClass} type="number" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} />
            </label>
            <label className={labelClass}>
              Điều chỉnh giá
              <input className={inputClass} type="number" value={form.priceAdjustment} onChange={(event) => setForm((current) => ({ ...current, priceAdjustment: event.target.value }))} />
            </label>
          </div>
          <label className={labelClass}>
            Đường dẫn ảnh (Image URL)
            <input className={inputClass} value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} />
          </label>
          {message ? <p className="text-green-600 font-medium m-0">{message}</p> : null}
          {error ? <p className="text-red-500 font-medium m-0">{error}</p> : null}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 border-none cursor-pointer transition-colors" type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
            {editingId ? (
              <button type="button" className="px-6 py-3 rounded-xl font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => {
                setEditingId("");
                setForm(initialForm);
              }}>
                Hủy
              </button>
            ) : null}
          </div>
        </form>

        <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
          <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Danh sách biến thể</h3>
          <div className="grid gap-3">
            {variants.map((variant) => (
              <div key={variant._id} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div>
                  <strong className="block text-slate-800 mb-1">{variant.productId?.name}</strong>
                  <p className="m-0 text-sm text-slate-500">
                    {variant.color} / {variant.size} · tồn kho {variant.stock}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors text-sm" onClick={() => handleEdit(variant)}>
                    Sửa
                  </button>
                  <button className="px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 border-none cursor-pointer transition-colors text-sm" onClick={() => handleDelete(variant._id)}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
