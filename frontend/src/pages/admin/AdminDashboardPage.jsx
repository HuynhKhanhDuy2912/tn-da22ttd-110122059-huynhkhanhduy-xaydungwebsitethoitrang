import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { fetchAdminBundle } from "../../lib/admin.js";

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [bundle, setBundle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminBundle(token);
        setBundle(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    load();
  }, [token]);

  const summaryCards = bundle
    ? [
        { label: "Người dùng", value: bundle.users.length },
        { label: "Danh mục", value: bundle.categories.length },
        { label: "Sản phẩm", value: bundle.products.length },
        { label: "Biến thể", value: bundle.variants.length },
        { label: "Gợi ý", value: bundle.outfits.length },
        { label: "Đơn hàng", value: bundle.orders.length }
      ]
    : [];

  const statusGroups = bundle
    ? bundle.orders.reduce((accumulator, order) => {
        accumulator[order.status] = (accumulator[order.status] || 0) + 1;
        return accumulator;
      }, {})
    : {};

  const topStyles = bundle
    ? bundle.products.reduce((accumulator, product) => {
        accumulator[product.style] = (accumulator[product.style] || 0) + 1;
        return accumulator;
      }, {})
    : {};

  return (
    <section className="grid gap-6">
      <AdminPageHeader
        title="Tổng quan"
        description="Báo cáo nhanh tình hình hoạt động của hệ thống cửa hàng."
      />
      {error ? <p className="text-red-500 font-medium">{error}</p> : null}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6">
        {summaryCards.map((item) => (
          <article key={item.label} className="bg-white p-6 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 flex flex-col items-start transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
            <span className="block text-[2.2rem] font-extrabold text-blue-500 mb-2 leading-none">{item.value}</span>
            <p className="text-slate-500 font-medium text-[0.95rem] m-0 uppercase tracking-wider">{item.label}</p>
          </article>
        ))}
      </div>

      {bundle ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
            <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Đơn hàng gần đây</h3>
            <div className="grid gap-3">
              {bundle.orders.slice(0, 5).map((order) => {
                let badgeClass = "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600";
                if (order.status === "pending") badgeClass = "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700";
                if (order.status === "shipped") badgeClass = "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700";
                if (order.status === "delivered") badgeClass = "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700";
                if (order.status === "cancelled") badgeClass = "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700";

                return (
                  <div key={order._id} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div>
                      <strong className="block text-slate-800 mb-1">{order.userId?.full_name || order.userId?.username}</strong>
                      <p className="m-0 text-sm text-slate-500">
                        <span className={badgeClass}>{order.status}</span>
                      </p>
                    </div>
                    <span className="font-bold text-blue-600">{order.totalPrice?.toLocaleString("vi-VN")} đ</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
            <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Sản phẩm sắp hết hàng</h3>
            <div className="grid gap-3">
              {bundle.variants
                .filter((item) => item.stock <= 10)
                .slice(0, 5)
                .map((variant) => (
                  <div key={variant._id} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div>
                      <strong className="block text-slate-800 mb-1">{variant.productId?.name || "Variant"}</strong>
                      <p className="m-0 text-sm text-slate-500">
                        {variant.color} / {variant.size}
                      </p>
                    </div>
                    <span className="font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">Còn {variant.stock}</span>
                  </div>
                ))}
            </div>
          </section>
        </div>
      ) : null}

      {bundle ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
            <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Phân tích trạng thái đơn hàng</h3>
            <div className="grid gap-3">
              {Object.entries(statusGroups).map(([status, count]) => (
                <div key={status} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <strong className="text-slate-800 capitalize">{status}</strong>
                  <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{count} đơn</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
            <h3 className="text-slate-900 text-xl m-0 mb-6 pb-4 border-b border-slate-100 font-bold">Phân tích kiểu dáng sản phẩm</h3>
            <div className="grid gap-3">
              {Object.entries(topStyles).map(([style, count]) => (
                <div key={style} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <strong className="text-slate-800 capitalize">{style}</strong>
                  <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{count} sản phẩm</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
