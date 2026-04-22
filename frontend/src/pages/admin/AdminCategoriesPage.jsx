import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const initialRootForm = { name: "" };
const initialChildForm = { name: "", parentId: "" };

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [rootForm, setRootForm] = useState(initialRootForm);
  const [childForm, setChildForm] = useState(initialChildForm);
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState({ name: "", parentId: "" });
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

  const showMessage = (msg) => {
    setMessage(msg);
    setError("");
    setTimeout(() => setMessage(""), 3000);
  };

  // Thêm danh mục gốc
  const handleAddRoot = async (event) => {
    event.preventDefault();
    if (!rootForm.name.trim()) return;
    try {
      await apiRequest("/categories", {
        method: "POST",
        token,
        body: { name: rootForm.name.trim(), parentId: null }
      });
      showMessage(`Đã thêm danh mục gốc "${rootForm.name}"`);
      setRootForm(initialRootForm);
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  // Thêm danh mục con
  const handleAddChild = async (event) => {
    event.preventDefault();
    if (!childForm.name.trim() || !childForm.parentId) return;
    try {
      await apiRequest("/categories", {
        method: "POST",
        token,
        body: { name: childForm.name.trim(), parentId: childForm.parentId }
      });
      const parent = categories.find(c => c._id === childForm.parentId);
      showMessage(`Đã thêm danh mục con "${childForm.name}" vào "${parent?.name}"`);
      setChildForm(prev => ({ ...prev, name: "" }));
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  // Cập nhật
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await apiRequest(`/categories/${editingId}`, {
        method: "PUT",
        token,
        body: { name: editForm.name, parentId: editForm.parentId || null }
      });
      showMessage("Đã cập nhật danh mục");
      setEditingId("");
      setEditForm({ name: "", parentId: "" });
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditForm({
      name: category.name || "",
      parentId: category.parentId?._id || ""
    });
  };

  const handleDelete = async (categoryId) => {
    try {
      await apiRequest(`/categories/${categoryId}`, { method: "DELETE", token });
      showMessage("Đã xóa danh mục");
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const inputClass = "border border-gray-300 px-4 py-3 bg-white text-black text-sm focus:border-black focus:outline-none w-full";
  const labelClass = "text-xs font-bold uppercase tracking-widest text-black flex flex-col gap-2";
  const rootCategories = categories.filter(c => !c.parentId);

  return (
    <section className="grid gap-6">
      <AdminPageHeader
        title="DANH MỤC"
        description="Tạo danh mục gốc (Nam, Nữ,...) trước, sau đó mới thêm danh mục con vào."
      />

      {/* Thông báo */}
      {message && (
        <p className="text-black bg-gray-100 px-4 py-3 font-bold text-xs uppercase tracking-widest border-l-4 border-black m-0">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-600 bg-red-50 px-4 py-3 font-bold text-xs uppercase tracking-widest border-l-4 border-red-600 m-0">
          {error}
        </p>
      )}

      {/* Modal sửa */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white border border-gray-300 p-8 w-full max-w-md grid gap-5"
          >
            <h3 className="text-black text-sm font-bold uppercase tracking-widest pb-4 border-b border-gray-200">
              SỬA DANH MỤC
            </h3>
            <label className={labelClass}>
              Tên danh mục
              <input
                className={inputClass}
                value={editForm.name}
                onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                autoFocus
              />
            </label>
            <label className={labelClass}>
              Danh mục cha
              <select
                className={inputClass}
                value={editForm.parentId}
                onChange={e => setEditForm(p => ({ ...p, parentId: e.target.value }))}
              >
                <option value="">Không có (Danh mục gốc)</option>
                {rootCategories
                  .filter(c => c._id !== editingId)
                  .map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
              </select>
            </label>
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors cursor-pointer border-none"
              >
                LƯU
              </button>
              <button
                type="button"
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-black bg-white border border-black hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => { setEditingId(""); setEditForm({ name: "", parentId: "" }); }}
              >
                HỦY
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 items-start">
        {/* Cột form bên trái */}
        <div className="grid gap-6">
          {/* Form 1: Thêm danh mục gốc */}
          <form
            onSubmit={handleAddRoot}
            className="bg-white border border-gray-200 p-7 grid gap-5"
          >
            <div>
              <h3 className="text-black text-sm font-bold uppercase tracking-widest mb-1">
                BƯỚC 1 — DANH MỤC GỐC
              </h3>
              <p className="text-xs text-gray-500 m-0">Ví dụ: Nam, Nữ, Unisex, Trẻ em</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <label className={labelClass}>
                Tên danh mục gốc
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    value={rootForm.name}
                    placeholder="Vd: Nam, Nữ, Unisex..."
                    onChange={e => setRootForm({ name: e.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={!rootForm.name.trim()}
                    className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    THÊM
                  </button>
                </div>
              </label>
            </div>
          </form>

          {/* Form 2: Thêm danh mục con */}
          <form
            onSubmit={handleAddChild}
            className={`bg-white border p-7 grid gap-5 transition-colors ${rootCategories.length === 0 ? "border-gray-100 opacity-50" : "border-gray-200"}`}
          >
            <div>
              <h3 className="text-black text-sm font-bold uppercase tracking-widest mb-1">
                BƯỚC 2 — DANH MỤC CON
              </h3>
              <p className="text-xs text-gray-500 m-0">Ví dụ: Áo thun, Quần jean, Áo polo</p>
            </div>
            <div className="border-t border-gray-100 pt-4 grid gap-4">
              {rootCategories.length === 0 ? (
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  ↑ Hãy tạo ít nhất một danh mục gốc trước
                </p>
              ) : (
                <>
                  <label className={labelClass}>
                    Thuộc danh mục gốc
                    <select
                      className={inputClass}
                      value={childForm.parentId}
                      onChange={e => setChildForm(p => ({ ...p, parentId: e.target.value }))}
                      required
                    >
                      <option value="">Chọn danh mục gốc...</option>
                      {rootCategories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className={labelClass}>
                    Tên danh mục con
                    <div className="flex gap-2">
                      <input
                        className={inputClass}
                        value={childForm.name}
                        placeholder="Vd: Áo thun, Quần jean..."
                        onChange={e => setChildForm(p => ({ ...p, name: e.target.value }))}
                      />
                      <button
                        type="submit"
                        disabled={!childForm.name.trim() || !childForm.parentId}
                        className="px-5 py-3 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      >
                        THÊM
                      </button>
                    </div>
                  </label>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Cột danh sách bên phải */}
        <section className="bg-white border border-gray-200 p-7">
          <h3 className="text-black text-sm font-bold uppercase tracking-widest m-0 mb-6 pb-4 border-b border-gray-200">
            CẤU TRÚC DANH MỤC ({rootCategories.length} gốc)
          </h3>

          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Chưa có danh mục nào. Hãy tạo danh mục gốc đầu tiên!
            </p>
          ) : (
            <div className="grid gap-0 divide-y divide-gray-200">
              {rootCategories.map(root => {
                const children = categories.filter(c => c.parentId?._id === root._id);
                return (
                  <div key={root._id} className="py-4 px-1">
                    {/* Danh mục gốc */}
                    <div className="flex items-center justify-between gap-4 group">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-300 font-bold">▶</span>
                        <div>
                          <strong className="text-black text-sm uppercase tracking-widest">
                            {root.name}
                          </strong>
                          <span className="ml-2 text-[10px] text-gray-400 uppercase tracking-widest">
                            {children.length} danh mục con
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black bg-white border border-black hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => handleEdit(root)}
                        >
                          SỬA
                        </button>
                        <button
                          className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 border border-red-600 cursor-pointer transition-colors"
                          onClick={() => handleDelete(root._id)}
                        >
                          XÓA
                        </button>
                      </div>
                    </div>

                    {/* Danh mục con */}
                    {children.length > 0 && (
                      <div className="mt-3 ml-6 pl-4 border-l-2 border-gray-200 grid gap-0 divide-y divide-gray-100">
                        {children.map(child => (
                          <div
                            key={child._id}
                            className="flex items-center justify-between gap-4 py-3 px-2 hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-black text-sm">{child.name}</span>
                            <div className="flex gap-2 shrink-0">
                              <button
                                className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black bg-white border border-black hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={() => handleEdit(child)}
                              >
                                SỬA
                              </button>
                              <button
                                className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 border border-red-600 cursor-pointer transition-colors"
                                onClick={() => handleDelete(child._id)}
                              >
                                XÓA
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
