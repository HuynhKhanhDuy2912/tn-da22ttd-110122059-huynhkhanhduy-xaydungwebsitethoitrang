import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import ImageUpload from "../../components/ImageUpload.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

const initialRootForm = { name: "" };
const initialChildForm = { name: "", parentId: "", imageUrl: "" };
const initialEditForm = { name: "", parentId: "", imageUrl: "" };

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [rootForm, setRootForm] = useState(initialRootForm);
  const [childForm, setChildForm] = useState(initialChildForm);
  const [editingId, setEditingId] = useState("");
  const [editForm, setEditForm] = useState(initialEditForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const rootCategories = categories.filter((category) => !category.parentId);

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

  const showMessage = (value) => {
    setMessage(value);
    setError("");
    window.setTimeout(() => setMessage(""), 3000);
  };

  const handleAddRoot = async (event) => {
    event.preventDefault();
    if (!rootForm.name.trim()) {
      return;
    }

    try {
      await apiRequest("/categories", {
        method: "POST",
        token,
        body: {
          name: rootForm.name.trim(),
          parentId: null,
          imageUrl: ""
        }
      });
      showMessage(`Đã thêm danh mục gốc "${rootForm.name}"`);
      setRootForm(initialRootForm);
      loadCategories();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleAddChild = async (event) => {
    event.preventDefault();

    if (!childForm.name.trim() || !childForm.parentId) {
      return;
    }

    try {
      await apiRequest("/categories", {
        method: "POST",
        token,
        body: {
          name: childForm.name.trim(),
          parentId: childForm.parentId,
          imageUrl: childForm.imageUrl
        }
      });
      const parent = categories.find((item) => item._id === childForm.parentId);
      showMessage(`Đã thêm danh mục con "${childForm.name}" vào "${parent?.name || "danh mục gốc"}"`);
      setChildForm(initialChildForm);
      loadCategories();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditForm({
      name: category.name || "",
      parentId: category.parentId?._id || "",
      imageUrl: category.imageUrl || ""
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      await apiRequest(`/categories/${editingId}`, {
        method: "PUT",
        token,
        body: {
          name: editForm.name.trim(),
          parentId: editForm.parentId || null,
          imageUrl: editForm.imageUrl || ""
        }
      });
      showMessage("Đã cập nhật danh mục");
      setEditingId("");
      setEditForm(initialEditForm);
      loadCategories();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await apiRequest(`/categories/${categoryId}`, {
        method: "DELETE",
        token
      });
      showMessage("Đã xóa danh mục");
      loadCategories();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const childrenOf = (rootId) =>
    categories.filter((category) => category.parentId?._id === rootId);

  const inputClass =
    "w-full border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black";
  const labelClass =
    "flex flex-col gap-2 text-xs font-bold uppercase tracking-widest text-black";

  return (
    <section className="grid gap-6">
      <AdminPageHeader
        title="DANH MỤC"
        description="Thêm danh mục gốc trước, sau đó tạo danh mục con và gắn hình ảnh để hiển thị đẹp hơn ở menu client."
      />

      {message ? (
        <p className="m-0 border-l-4 border-black bg-gray-100 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="m-0 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-600">
          {error}
        </p>
      ) : null}

      {editingId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleUpdate}
            className="grid w-full max-w-2xl gap-5 border border-gray-300 bg-white p-8"
          >
            <h3 className="border-b border-gray-200 pb-4 text-sm font-bold uppercase tracking-widest text-black">
              SỬA DANH MỤC
            </h3>

            <div className="grid gap-5 md:grid-cols-[1fr_1fr]">
              <label className={labelClass}>
                Tên danh mục
                <input
                  className={inputClass}
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </label>

              <label className={labelClass}>
                Danh mục cha
                <select
                  className={inputClass}
                  value={editForm.parentId}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, parentId: event.target.value }))
                  }
                >
                  <option value="">Không có (Danh mục gốc)</option>
                  {rootCategories
                    .filter((item) => item._id !== editingId)
                    .map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </label>
            </div>

            <ImageUpload
              label="HÌNH DANH MỤC"
              value={editForm.imageUrl}
              onChange={(url) =>
                setEditForm((current) => ({
                  ...current,
                  imageUrl: url
                }))
              }
            />

            <div className="flex gap-3 border-t border-gray-200 pt-4">
              <button
                type="submit"
                className="cursor-pointer border-none bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
              >
                Lưu
              </button>
              <button
                type="button"
                className="cursor-pointer border border-black bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-gray-100"
                onClick={() => {
                  setEditingId("");
                  setEditForm(initialEditForm);
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.55fr]">
        <div className="grid gap-6">
          <form
            onSubmit={handleAddRoot}
            className="grid gap-5 border border-gray-200 bg-white p-7"
          >
            <div>
              <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-black">
                BƯỚC 1 - DANH MỤC GỐC
              </h3>
              <p className="m-0 text-xs text-gray-500">Ví dụ: Nam, Nữ, Unisex</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <label className={labelClass}>
                Tên danh mục gốc
                <div className="flex gap-2">
                  <input
                    className={inputClass}
                    value={rootForm.name}
                    placeholder="Ví dụ: Nam, Nữ..."
                    onChange={(event) => setRootForm({ name: event.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={!rootForm.name.trim()}
                    className="shrink-0 cursor-pointer border-none bg-black px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Thêm
                  </button>
                </div>
              </label>
            </div>
          </form>

          <form
            onSubmit={handleAddChild}
            className={`grid gap-5 border bg-white p-7 transition-colors ${
              rootCategories.length === 0 ? "border-gray-100 opacity-50" : "border-gray-200"
            }`}
          >
            <div>
              <h3 className="mb-1 text-sm font-bold uppercase tracking-widest text-black">
                BƯỚC 2 - DANH MỤC CON
              </h3>
              <p className="m-0 text-xs text-gray-500">
                Ví dụ: Áo thun, Quần jean, Áo polo và thêm hình để hiển thị ở mega menu.
              </p>
            </div>

            <div className="grid gap-4 border-t border-gray-100 pt-4">
              {rootCategories.length === 0 ? (
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Hãy tạo ít nhất một danh mục gốc trước
                </p>
              ) : (
                <>
                  <label className={labelClass}>
                    Thuộc danh mục gốc
                    <select
                      className={inputClass}
                      value={childForm.parentId}
                      onChange={(event) =>
                        setChildForm((current) => ({
                          ...current,
                          parentId: event.target.value
                        }))
                      }
                      required
                    >
                      <option value="">Chọn danh mục gốc...</option>
                      {rootCategories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Tên danh mục con
                    <input
                      className={inputClass}
                      value={childForm.name}
                      placeholder="Ví dụ: Áo thun, Quần jean..."
                      onChange={(event) =>
                        setChildForm((current) => ({
                          ...current,
                          name: event.target.value
                        }))
                      }
                    />
                  </label>

                  <ImageUpload
                    label="HÌNH DANH MỤC CON"
                    value={childForm.imageUrl}
                    onChange={(url) =>
                      setChildForm((current) => ({
                        ...current,
                        imageUrl: url
                      }))
                    }
                  />

                  <button
                    type="submit"
                    disabled={!childForm.name.trim() || !childForm.parentId}
                    className="w-fit cursor-pointer border-none bg-black px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Thêm danh mục con
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        <section className="border border-gray-200 bg-white p-7">
          <h3 className="mb-6 border-b border-gray-200 pb-4 text-sm font-bold uppercase tracking-widest text-black">
            CẤU TRÚC DANH MỤC ({rootCategories.length} gốc)
          </h3>

          {categories.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              Chưa có danh mục nào. Hãy tạo danh mục gốc đầu tiên.
            </p>
          ) : (
            <div className="grid divide-y divide-gray-200">
              {rootCategories.map((root) => {
                const children = childrenOf(root._id);

                return (
                  <div key={root._id} className="px-1 py-4">
                    <div className="group flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-300">▶</span>
                        <div>
                          <strong className="text-sm uppercase tracking-widest text-black">
                            {root.name}
                          </strong>
                          <span className="ml-2 text-[10px] uppercase tracking-widest text-gray-400">
                            {children.length} danh mục con
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          className="cursor-pointer border border-black bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-gray-100"
                          onClick={() => handleEdit(root)}
                        >
                          Sửa
                        </button>
                        <button
                          className="cursor-pointer border border-red-600 bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-700"
                          onClick={() => handleDelete(root._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    {children.length > 0 ? (
                      <div className="mt-4 ml-6 grid gap-3 border-l-2 border-gray-200 pl-4">
                        {children.map((child) => (
                          <div
                            key={child._id}
                            className="flex items-center justify-between gap-4 rounded-sm border border-gray-100 bg-gray-50 px-3 py-3 transition-colors hover:bg-white"
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <div className="h-14 w-14 shrink-0 overflow-hidden border border-gray-200 bg-white">
                                {child.imageUrl ? (
                                  <img
                                    src={child.imageUrl}
                                    alt={child.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="grid h-full w-full place-items-center text-[10px] font-bold uppercase tracking-widest text-gray-300">
                                    No image
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-black">{child.name}</p>
                                <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-400">
                                  {child.imageUrl ? "Có hình hiển thị" : "Chưa có hình"}
                                </p>
                              </div>
                            </div>
                            <div className="flex shrink-0 gap-2">
                              <button
                                className="cursor-pointer border border-black bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-gray-100"
                                onClick={() => handleEdit(child)}
                              >
                                Sửa
                              </button>
                              <button
                                className="cursor-pointer border border-red-600 bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-700"
                                onClick={() => handleDelete(child._id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
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
