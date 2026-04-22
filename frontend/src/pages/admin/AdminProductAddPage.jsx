import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";
import ImageUpload from "../../components/ImageUpload.jsx";
import { Star, Trash2, StarOff } from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  price: "",
  discount: 0,
  categoryId: "",
  brand: "",
  gender: "unisex",
  material: "",
  style: "casual",
  season: "all_season",
  occasion: "casual",
  mainImage: ""
};

export default function AdminProductAddPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [selectedRootId, setSelectedRootId] = useState(""); // danh mục gốc đang chọn
  const [galleryImages, setGalleryImages] = useState([]);   // từ API ProductImage
  const [newGalleryUrl, setNewGalleryUrl] = useState("");   // ảnh mới đang upload
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const catRes = await apiRequest("/categories", { token });
        setCategories(catRes.data);

        if (editId) {
          const [prodRes, imgRes] = await Promise.all([
            apiRequest(`/products/${editId}`, { token }),
            apiRequest(`/product-images?productId=${editId}&limit=50`, { token })
          ]);
          const p = prodRes.data;
          const childCatId = p.categoryId?._id || "";
          // Tìm parentId của danh mục con để tự động chọn root
          const childCat = catRes.data.find(c => c._id === childCatId);
          setSelectedRootId(childCat?.parentId?._id || "");
          setForm({
            name: p.name || "",
            description: p.description || "",
            price: p.price || "",
            discount: p.discount || 0,
            categoryId: childCatId,
            brand: p.brand || "",
            gender: p.gender || "unisex",
            material: p.material || "",
            style: p.style || "casual",
            season: p.season?.[0] || "all_season",
            occasion: p.occasion?.[0] || "casual",
            mainImage: p.images?.[0] || ""
          });
          setGalleryImages(imgRes.data || []);
        }
      } catch (e) {
        setError(e.message);
      }
    };
    loadData();
  }, [token, editId]);

  // ─── Submit form chính ───────────────────────────────────────────────────────
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
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
        images: form.mainImage ? [form.mainImage] : []
      };

      if (editId) {
        await apiRequest(`/products/${editId}`, { method: "PUT", token, body: payload });
        setMessage("✓ Đã cập nhật sản phẩm thành công");
      } else {
        const res = await apiRequest("/products", { method: "POST", token, body: payload });
        setMessage("✓ Đã thêm sản phẩm thành công — Bạn có thể thêm ảnh gallery bên dưới");
        // Redirect sang edit mode để có thể thêm gallery
        navigate(`/admin/products/add?id=${res.data._id}`, { replace: true });
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Thêm ảnh gallery ────────────────────────────────────────────────────────
  const handleAddGallery = async () => {
    if (!newGalleryUrl || !editId) return;
    try {
      const isFirstImage = galleryImages.length === 0;
      const res = await apiRequest("/product-images", {
        method: "POST",
        token,
        body: { productId: editId, imageUrl: newGalleryUrl, isMain: isFirstImage }
      });
      setGalleryImages(prev => [...prev, res.data]);
      setNewGalleryUrl("");
    } catch (e) {
      setError(e.message);
    }
  };

  // ─── Xóa ảnh gallery ─────────────────────────────────────────────────────────
  const handleDeleteGallery = async (imageId) => {
    try {
      await apiRequest(`/product-images/${imageId}`, { method: "DELETE", token });
      setGalleryImages(prev => prev.filter(img => img._id !== imageId));
    } catch (e) {
      setError(e.message);
    }
  };

  // ─── Đặt ảnh chính (isMain) ──────────────────────────────────────────────────
  const handleSetMain = async (imageId) => {
    try {
      // Bỏ isMain tất cả, sau đó set lại
      await Promise.all(
        galleryImages.map(img =>
          apiRequest(`/product-images/${img._id}`, {
            method: "PUT",
            token,
            body: { ...img, isMain: img._id === imageId }
          })
        )
      );
      setGalleryImages(prev =>
        prev.map(img => ({ ...img, isMain: img._id === imageId }))
      );
    } catch (e) {
      setError(e.message);
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm(c => ({ ...c, [key]: e.target.value }))
  });

  const inputCls = "border border-gray-200 px-4 py-3 bg-white text-black text-sm focus:border-black focus:outline-none w-full transition-colors";
  const labelCls = "text-[10px] font-bold uppercase tracking-widest text-gray-500 flex flex-col gap-1.5";
  const rootCategories = categories.filter(c => !c.parentId);
  const childCategories = selectedRootId
    ? categories.filter(c => c.parentId?._id === selectedRootId)
    : [];
  // Danh mục gốc không có con => dùng luôn root làm categoryId
  const rootHasNoChildren = selectedRootId && childCategories.length === 0;

  return (
    <section className="grid gap-0">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6 sticky top-0 z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest m-0 mb-1">
            Sản phẩm / {editId ? "Chỉnh sửa" : "Thêm mới"}
          </p>
          <h1 className="text-xl font-bold uppercase tracking-widest m-0 text-black">
            {editId ? "SỬA SẢN PHẨM" : "THÊM SẢN PHẨM MỚI"}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/products/list")}
          className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-black bg-white border border-gray-300 hover:border-black transition-colors cursor-pointer"
        >
          ← Quay lại
        </button>
      </div>

      {/* Thông báo */}
      {message && (
        <div className="bg-green-50 border-b border-green-200 px-8 py-3">
          <p className="text-green-700 text-xs font-bold uppercase tracking-widest m-0">{message}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-8 py-3">
          <p className="text-red-600 text-xs font-bold uppercase tracking-widest m-0">{error}</p>
        </div>
      )}

      {/* Body */}
      <form id="product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-[1fr_360px] gap-0 min-h-screen">

          {/* ── Cột trái: thông tin ── */}
          <div className="border-r border-gray-200 p-8 grid gap-6 content-start">

            {/* Card: Thông tin cơ bản */}
            <div className="bg-white border border-gray-200 p-6 grid gap-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black pb-4 border-b border-gray-100 m-0">
                Thông tin cơ bản
              </h2>
              <label className={labelCls}>
                Tên sản phẩm *
                <input className={inputCls} required placeholder="Vd: Áo thun oversize basic" {...field("name")} />
              </label>
              <label className={labelCls}>
                Mô tả sản phẩm
                <textarea
                  className={inputCls}
                  rows="4"
                  placeholder="Mô tả chi tiết về chất liệu, form dáng, phong cách..."
                  value={form.description}
                  onChange={e => setForm(c => ({ ...c, description: e.target.value }))}
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={labelCls}>
                  Danh mục gốc *
                  <select
                    className={inputCls}
                    value={selectedRootId}
                    onChange={e => {
                      const rootId = e.target.value;
                      const children = categories.filter(c => c.parentId?._id === rootId);
                      setSelectedRootId(rootId);
                      // Nếu không có con => dùng luôn root làm categoryId
                      setForm(c => ({ ...c, categoryId: children.length === 0 ? rootId : "" }));
                    }}
                  >
                    <option value="">Chọn danh mục gốc...</option>
                    {rootCategories.map(root => (
                      <option key={root._id} value={root._id}>{root.name}</option>
                    ))}
                  </select>
                </label>

                {/* Chỉ hiện dropdown con khi root có con */}
                {selectedRootId && !rootHasNoChildren && (
                  <label className={labelCls}>
                    Danh mục con *
                    <select
                      className={inputCls}
                      required
                      value={form.categoryId}
                      onChange={e => setForm(c => ({ ...c, categoryId: e.target.value }))}
                    >
                      <option value="">Chọn danh mục con...</option>
                      {childCategories.map(child => (
                        <option key={child._id} value={child._id}>{child.name}</option>
                      ))}
                    </select>
                  </label>
                )}

                {/* Thông báo khi root không có con */}
                {rootHasNoChildren && (
                  <div className={`${labelCls} justify-end`}>
                    <span className="invisible text-[10px]">_</span>
                    <div className="border border-gray-200 px-4 py-3 bg-gray-50 text-xs text-gray-500 flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      Danh mục đơn — không có danh mục con
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card: Giá */}
            <div className="bg-white border border-gray-200 p-6 grid gap-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black pb-4 border-b border-gray-100 m-0">
                Giá bán
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <label className={labelCls}>
                  Giá gốc (VND) *
                  <div className="relative">
                    <input
                      className={inputCls + " pr-10"}
                      type="number"
                      min="0"
                      required
                      placeholder="0"
                      {...field("price")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">₫</span>
                  </div>
                </label>
                <label className={labelCls}>
                  Giảm giá (%)
                  <div className="relative">
                    <input
                      className={inputCls + " pr-10"}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      {...field("discount")}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">%</span>
                  </div>
                </label>
              </div>
              {form.price && Number(form.discount) > 0 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-widest">Giá sau giảm</span>
                  <span className="text-sm font-bold text-black">
                    {Math.round(Number(form.price) * (1 - Number(form.discount) / 100)).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}
            </div>

            {/* Card: Phân loại */}
            <div className="bg-white border border-gray-200 p-6 grid gap-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black pb-4 border-b border-gray-100 m-0">
                Phân loại
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <label className={labelCls}>
                  Giới tính
                  <select className={inputCls} value={form.gender} onChange={e => setForm(c => ({ ...c, gender: e.target.value }))}>
                    <option value="unisex">Unisex</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </label>
                <label className={labelCls}>
                  Kiểu dáng
                  <select className={inputCls} value={form.style} onChange={e => setForm(c => ({ ...c, style: e.target.value }))}>
                    <option value="casual">Casual</option>
                    <option value="minimal">Minimal</option>
                    <option value="streetwear">Streetwear</option>
                    <option value="elegant">Elegant</option>
                    <option value="sporty">Sporty</option>
                    <option value="vintage">Vintage</option>
                    <option value="smart_casual">Smart Casual</option>
                  </select>
                </label>
                <label className={labelCls}>
                  Mùa
                  <select className={inputCls} value={form.season} onChange={e => setForm(c => ({ ...c, season: e.target.value }))}>
                    <option value="all_season">Tất cả mùa</option>
                    <option value="spring">Xuân</option>
                    <option value="summer">Hè</option>
                    <option value="autumn">Thu</option>
                    <option value="winter">Đông</option>
                  </select>
                </label>
                <label className={labelCls}>
                  Dịp mặc
                  <select className={inputCls} value={form.occasion} onChange={e => setForm(c => ({ ...c, occasion: e.target.value }))}>
                    <option value="casual">Thường ngày</option>
                    <option value="work">Đi làm</option>
                    <option value="party">Tiệc tùng</option>
                    <option value="date">Hẹn hò</option>
                    <option value="travel">Du lịch</option>
                    <option value="sport">Thể thao</option>
                    <option value="formal">Trang trọng</option>
                    <option value="street">Dạo phố</option>
                  </select>
                </label>
                <label className={labelCls}>
                  Thương hiệu
                  <input className={inputCls} placeholder="Vd: Routine, H&M..." {...field("brand")} />
                </label>
                <label className={labelCls}>
                  Chất liệu
                  <input className={inputCls} placeholder="Vd: Cotton, Polyester..." {...field("material")} />
                </label>
              </div>
            </div>
          </div>

          {/* ── Cột phải: ảnh ── */}
          <div className="p-6 grid gap-6 content-start">

            {/* Card: Ảnh chính */}
            <div className="bg-white border border-gray-200 p-6 grid gap-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black pb-4 border-b border-gray-100 m-0">
                Ảnh chính
              </h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest m-0">
                Ảnh hiển thị trên danh sách & trang chủ
              </p>
              <ImageUpload
                label=""
                value={form.mainImage}
                onChange={url => setForm(c => ({ ...c, mainImage: url }))}
              />
            </div>

            {/* Card: Ảnh gallery (chỉ hiện khi đang edit) */}
            {editId ? (
              <div className="bg-white border border-gray-200 p-6 grid gap-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-black pb-4 border-b border-gray-100 m-0">
                  Ảnh Gallery ({galleryImages.length})
                </h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest m-0">
                  Ảnh hiển thị trong trang chi tiết sản phẩm
                </p>

                {/* Upload ảnh mới vào gallery */}
                <div className="border border-dashed border-gray-300 p-1">
                  <ImageUpload
                    label=""
                    value={newGalleryUrl}
                    onChange={(url) => {
                      setNewGalleryUrl(url);
                    }}
                  />
                  {newGalleryUrl && (
                    <button
                      type="button"
                      onClick={handleAddGallery}
                      className="mt-2 w-full py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 border-none cursor-pointer transition-colors"
                    >
                      + Thêm vào gallery
                    </button>
                  )}
                </div>

                {/* Danh sách ảnh gallery */}
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {galleryImages.map(img => (
                      <div
                        key={img._id}
                        className={`relative border-2 ${img.isMain ? "border-black" : "border-gray-200"} group`}
                      >
                        <img
                          src={img.imageUrl}
                          alt=""
                          className="w-full aspect-square object-cover"
                        />
                        {img.isMain && (
                          <span className="absolute top-1 left-1 bg-black text-white text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5">
                            CHÍNH
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!img.isMain && (
                            <button
                              type="button"
                              title="Đặt làm ảnh chính"
                              onClick={() => handleSetMain(img._id)}
                              className="p-1.5 bg-white hover:bg-yellow-50 cursor-pointer border-none"
                            >
                              <Star size={14} className="text-black" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Xóa ảnh"
                            onClick={() => handleDeleteGallery(img._id)}
                            className="p-1.5 bg-white hover:bg-red-50 cursor-pointer border-none"
                          >
                            <Trash2 size={14} className="text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 p-6 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest m-0">
                  Lưu sản phẩm trước để thêm ảnh gallery
                </p>
              </div>
            )}

            {/* Nút submit */}
            <button
              form="product-form"
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors cursor-pointer border-none disabled:opacity-50"
            >
              {loading ? "ĐANG LƯU..." : editId ? "✓ LƯU THAY ĐỔI" : "+ THÊM SẢN PHẨM"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
