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

  const inputClass = "border border-gray-300 px-4 py-3 bg-white text-black text-sm focus:border-black focus:outline-none w-full";
  const labelClass = "text-xs font-bold uppercase tracking-widest text-black flex flex-col gap-2";

  return (
    <section className="grid gap-6">
      <AdminPageHeader title="DANH MỤC" description="Tạo và quản lý các danh mục sản phẩm." />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <form className="bg-white border border-gray-200 p-7 grid gap-5 sticky top-6" onSubmit={handleSubmit}>
          <h3 className="text-black text-sm m-0 mb-2 pb-4 border-b border-gray-200 font-bold uppercase tracking-widest">{editingId ? "SỬA DANH MỤC" : "THÊM DANH MỤC MỚI"}</h3>
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
          {message ? <p className="text-black bg-gray-100 px-4 py-3 font-bold text-xs uppercase tracking-widest border-l-4 border-black m-0">{message}</p> : null}
          {error ? <p className="text-red-600 bg-red-50 px-4 py-3 font-bold text-xs uppercase tracking-widest border-l-4 border-red-600 m-0">{error}</p> : null}
          <div className="flex gap-3 pt-4 border-t border-gray-200 mt-2">
            <button className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors cursor-pointer border-none" type="submit">{editingId ? "CẬP NHẬT" : "THÊM MỚI"}</button>
            {editingId ? (
              <button
                type="button"
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-black bg-white border border-black hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => {
                  setEditingId("");
                  setForm(initialForm);
                }}
              >
                HỦY
              </button>
            ) : null}
          </div>
        </form>

        <section className="bg-white border border-gray-200 p-7">
          <h3 className="text-black text-sm m-0 mb-6 pb-4 border-b border-gray-200 font-bold uppercase tracking-widest">DANH SÁCH DANH MỤC</h3>
          <div className="grid gap-0 divide-y divide-gray-100">
            {categories.map((category) => (
              <div key={category._id} className="flex justify-between gap-4 py-4 items-center hover:bg-gray-50 transition-colors px-2">
                <div>
                  <strong className="block text-black mb-1 text-sm">{category.name}</strong>
                  <p className="m-0 text-xs text-gray-500 uppercase tracking-widest">{category.parentId?.name || "Danh mục gốc"}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-black bg-white border border-black hover:bg-gray-100 cursor-pointer transition-colors" onClick={() => handleEdit(category)}>
                    SỬA
                  </button>
                  <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 border border-red-600 cursor-pointer transition-colors" onClick={() => handleDelete(category._id)}>XÓA</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
