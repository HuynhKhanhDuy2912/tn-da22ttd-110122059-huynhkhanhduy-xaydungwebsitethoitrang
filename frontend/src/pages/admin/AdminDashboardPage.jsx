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
          <article key={item.label} className="bg-white p-6 border border-gray-200 flex flex-col items-start transition-colors hover:border-black">
            <span className="block text-[2.2rem] font-extrabold text-black mb-2 leading-none">{item.value}</span>
            <p className="text-gray-500 font-bold text-[0.8rem] m-0 uppercase tracking-widest">{item.label}</p>
          </article>
        ))}
      </div>

      {bundle ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-gray-200 p-7">
            <h3 className="text-black text-sm m-0 mb-6 pb-4 border-b border-gray-200 font-bold uppercase tracking-widest">Đơn hàng gần đây</h3>
            <div className="grid gap-0 divide-y divide-gray-100">
              {bundle.orders.slice(0, 5).map((order) => {
                let badgeClass = "px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600";
                if (order.status === "pending") badgeClass = "px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-gray-200 text-black";
                if (order.status === "shipped") badgeClass = "px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-black text-white";
                if (order.status === "delivered") badgeClass = "px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-black text-white";
                if (order.status === "cancelled") badgeClass = "px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-red-100 text-red-600";

                return (
                  <div key={order._id} className="flex justify-between gap-4 py-4 items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <strong className="block text-black mb-2 text-sm">{order.userId?.full_name || order.userId?.username}</strong>
                      <p className="m-0">
                        <span className={badgeClass}>{order.status}</span>
                      </p>
                    </div>
                    <span className="font-bold text-black text-sm">{order.totalPrice?.toLocaleString("vi-VN")} ₫</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white border border-gray-200 p-7">
            <h3 className="text-black text-sm m-0 mb-6 pb-4 border-b border-gray-200 font-bold uppercase tracking-widest">Sản phẩm sắp hết hàng</h3>
            <div className="grid gap-0 divide-y divide-gray-100">
              {bundle.variants
                .filter((item) => item.stock <= 10)
                .slice(0, 5)
                .map((variant) => (
                  <div key={variant._id} className="flex justify-between gap-4 py-4 items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <strong className="block text-black mb-1 text-sm">{variant.productId?.name || "Variant"}</strong>
                      <p className="m-0 text-xs text-gray-500 uppercase tracking-widest">
                        {variant.color} - {variant.size}
                      </p>
                    </div>
                    <span className="font-bold text-red-600 text-sm">Còn {variant.stock}</span>
                  </div>
                ))}
            </div>
          </section>
        </div>
      ) : null}

      {bundle ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-gray-200 p-7">
            <h3 className="text-black text-sm m-0 mb-6 pb-4 border-b border-gray-200 font-bold uppercase tracking-widest">Phân tích trạng thái đơn hàng</h3>
            <div className="grid gap-0 divide-y divide-gray-100">
              {Object.entries(statusGroups).map(([status, count]) => (
                <div key={status} className="flex justify-between gap-4 py-4 items-center hover:bg-gray-50 transition-colors">
                  <strong className="text-black capitalize text-sm">{status}</strong>
                  <span className="font-bold text-black text-sm">{count} đơn</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-gray-200 p-7">
            <h3 className="text-black text-sm m-0 mb-6 pb-4 border-b border-gray-200 font-bold uppercase tracking-widest">Phân tích kiểu dáng sản phẩm</h3>
            <div className="grid gap-0 divide-y divide-gray-100">
              {Object.entries(topStyles).map(([style, count]) => (
                <div key={style} className="flex justify-between gap-4 py-4 items-center hover:bg-gray-50 transition-colors">
                  <strong className="text-black capitalize text-sm">{style}</strong>
                  <span className="font-bold text-black text-sm">{count} sản phẩm</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
