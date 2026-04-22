import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const initialForm = {
  name: "",
  parentId: ""
};

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    try {
      const response = await apiRequest("/categories", { token });
      setCategories(response.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await apiRequest(`/categories/${editingId}`, {
          method: "PUT",
          token,
          body: {
            ...form,
            parentId: form.parentId || null
          }
        });
        setMessage("Đã cập nhật danh mục");
      } else {
        await apiRequest("/categories", {
          method: "POST",
          token,
          body: {
            ...form,
            parentId: form.parentId || null
          }
        });
        setMessage("Đã thêm danh mục");
      }

      setForm(initialForm);
      setEditingId("");
      loadCategories();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name || "",
      parentId: category.parentId?._id || ""
    });
  };

  const handleDelete = async (categoryId) => {
    try {
      await apiRequest(`/categories/${categoryId}`, {
        method: "DELETE",
        token
      });
      setMessage("Đã xóa danh mục");
      loadCategories();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const inputClass = "border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 transition-all text-[0.95rem] focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none w-full";
  const labelClass = "font-medium text-slate-700 text-[0.95rem] flex flex-col gap-2";

  return (
    <section className="grid gap-6">
      <AdminPageHeader title="Danh mục" description="Tạo và quản lý các danh mục sản phẩm." />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <form className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 grid gap-5 sticky top-6" onSubmit={handleSubmit}>
          <h3 className="text-slate-900 text-xl m-0 mb-2 pb-4 border-b border-slate-100 font-bold">{editingId ? "Sửa danh mục" : "Thêm danh mục mới"}</h3>
          <label className={labelClass}>
            Tên danh mục
            <input
              className={inputClass}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </label>
          <label className={labelClass}>
            Danh mục cha
            <select
              className={inputClass}
              value={form.parentId}
              onChange={(event) =>
                setForm((current) => ({ ...current, parentId: event.target.value }))
              }
            >
              <option value="">Không có</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          {message ? <p className="text-green-600 font-medium m-0">{message}</p> : null}
          {error ? <p className="text-red-500 font-medium m-0">{error}</p> : null}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-700 border-none cursor-pointer transition-colors" type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
            {editingId ? (
              <button
                type="button"
                className="px-6 py-3 rounded-xl font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => {
                  setEditingId("");
                  setForm(initialForm);
                }}
              >
                Hủy
              </button>
            ) : null}
          </div>
        </form>

        <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
          <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Danh sách danh mục</h3>
          <div className="grid gap-3">
            {categories.map((category) => (
              <div key={category._id} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div>
                  <strong className="block text-slate-800 mb-1">{category.name}</strong>
                  <p className="m-0 text-sm text-slate-500">{category.parentId?.name || "Danh mục gốc"}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors text-sm" onClick={() => handleEdit(category)}>
                    Sửa
                  </button>
                  <button className="px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 border-none cursor-pointer transition-colors text-sm" onClick={() => handleDelete(category._id)}>Xóa</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
