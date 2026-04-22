import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const initialForm = {
  name: "",
  description: "",
  price: 0,
  discount: 0,
  categoryId: "",
  brand: "",
  gender: "unisex",
  material: "",
  style: "casual",
  season: "all_season",
  occasion: "casual",
  imageUrl: ""
};

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        apiRequest("/products", { token }),
        apiRequest("/categories", { token })
      ]);

      setProducts(productResponse.data);
      setCategories(categoryResponse.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const buildPayload = () => ({
    name: form.name,
    description: form.description,
    price: Number(form.price),
    discount: Number(form.discount),
    categoryId: form.categoryId,
    brand: form.brand,
    gender: form.gender,
    material: form.material,
    style: form.style,
    season: [form.season],
    occasion: [form.occasion],
    images: form.imageUrl ? [form.imageUrl] : []
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await apiRequest(`/products/${editingId}`, {
          method: "PUT",
          token,
          body: buildPayload()
        });
        setMessage("Đã cập nhật sản phẩm");
      } else {
        await apiRequest("/products", {
          method: "POST",
          token,
          body: buildPayload()
        });
        setMessage("Đã thêm sản phẩm");
      }

      setForm(initialForm);
      setEditingId("");
      loadData();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || 0,
      discount: product.discount || 0,
      categoryId: product.categoryId?._id || "",
      brand: product.brand || "",
      gender: product.gender || "unisex",
      material: product.material || "",
      style: product.style || "casual",
      season: product.season?.[0] || "all_season",
      occasion: product.occasion?.[0] || "casual",
      imageUrl: product.images?.[0] || ""
    });
  };

  const handleDelete = async (productId) => {
    try {
      await apiRequest(`/products/${productId}`, {
        method: "DELETE",
        token
      });
      setMessage("Đã xóa sản phẩm");
      loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const inputClass = "border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 transition-all text-[0.95rem] focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-full";
  const labelClass = "font-medium text-slate-700 text-[0.95rem] flex flex-col gap-2";

  return (
    <section className="grid gap-6">
      <AdminPageHeader title="Sản phẩm" description="Quản lý danh sách sản phẩm cốt lõi." />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <form className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 grid gap-5 sticky top-6" onSubmit={handleSubmit}>
          <h3 className="text-slate-900 text-xl m-0 mb-2 pb-4 border-b border-slate-100 font-bold">{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
          <label className={labelClass}>
            Tên sản phẩm
            <input className={inputClass} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label className={labelClass}>
            Mô tả
            <textarea
              className={inputClass}
              rows="3"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </label>
          <label className={labelClass}>
            Danh mục
            <select
              className={inputClass}
              value={form.categoryId}
              onChange={(event) =>
                setForm((current) => ({ ...current, categoryId: event.target.value }))
              }
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              Giá
              <input
                className={inputClass}
                type="number"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({ ...current, price: event.target.value }))
                }
              />
            </label>
            <label className={labelClass}>
              Giảm giá
              <input
                className={inputClass}
                type="number"
                value={form.discount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, discount: event.target.value }))
                }
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              Giới tính
              <select
                className={inputClass}
                value={form.gender}
                onChange={(event) =>
                  setForm((current) => ({ ...current, gender: event.target.value }))
                }
              >
                <option value="unisex">Unisex</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </label>
            <label className={labelClass}>
              Kiểu dáng
              <select
                className={inputClass}
                value={form.style}
                onChange={(event) =>
                  setForm((current) => ({ ...current, style: event.target.value }))
                }
              >
                <option value="casual">casual</option>
                <option value="minimal">minimal</option>
                <option value="streetwear">streetwear</option>
                <option value="elegant">elegant</option>
                <option value="sporty">sporty</option>
                <option value="vintage">vintage</option>
                <option value="smart_casual">smart_casual</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              Mùa
              <input
                className={inputClass}
                value={form.season}
                onChange={(event) =>
                  setForm((current) => ({ ...current, season: event.target.value }))
                }
              />
            </label>
            <label className={labelClass}>
              Dịp
              <input
                className={inputClass}
                value={form.occasion}
                onChange={(event) =>
                  setForm((current) => ({ ...current, occasion: event.target.value }))
                }
              />
            </label>
          </div>
          <label className={labelClass}>
            Thương hiệu
            <input
              className={inputClass}
              value={form.brand}
              onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
            />
          </label>
          <label className={labelClass}>
            Chất liệu
            <input
              className={inputClass}
              value={form.material}
              onChange={(event) =>
                setForm((current) => ({ ...current, material: event.target.value }))
              }
            />
          </label>
          <label className={labelClass}>
            Đường dẫn ảnh (Image URL)
            <input
              className={inputClass}
              value={form.imageUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, imageUrl: event.target.value }))
              }
            />
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
          <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Danh sách sản phẩm</h3>
          <div className="grid gap-3">
            {products.map((product) => (
              <div key={product._id} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div>
                  <strong className="block text-slate-800 mb-1">{product.name}</strong>
                  <p className="m-0 text-sm text-slate-500">
                    {product.categoryId?.name} · {product.style}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors text-sm" onClick={() => handleEdit(product)}>
                    Sửa
                  </button>
                  <button className="px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 border-none cursor-pointer transition-colors text-sm" onClick={() => handleDelete(product._id)}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
