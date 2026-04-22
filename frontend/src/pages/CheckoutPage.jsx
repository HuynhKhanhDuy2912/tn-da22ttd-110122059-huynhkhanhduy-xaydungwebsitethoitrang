import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export default function CheckoutPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    receiverName: user?.full_name || user?.username || "",
    receiverPhone: user?.phone_number || "",
    shippingAddress: user?.address || "",
    note: "",
    paymentMethod: "cod"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiRequest("/orders/checkout", {
        method: "POST",
        token,
        body: form
      });
      navigate("/orders");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border border-slate-200 rounded-xl px-4 py-3.5 bg-slate-50/50 text-slate-900 transition-all focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none w-full text-[0.95rem]";
  const labelClass = "flex flex-col gap-2 font-medium text-slate-700 text-[0.95rem]";

  return (
    <div className="px-4 md:px-8 py-8 md:py-12 max-w-3xl mx-auto">
      <PageHeader
        title="Thanh toán"
        description="Điền thông tin để hoàn tất đơn hàng của bạn."
      />
      <form className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-slate-100 mt-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <label className={labelClass}>
            Tên người nhận
            <input
              className={inputClass}
              value={form.receiverName}
              onChange={(event) =>
                setForm((current) => ({ ...current, receiverName: event.target.value }))
              }
              placeholder="Nhập họ tên"
            />
          </label>
          <label className={labelClass}>
            Số điện thoại
            <input
              className={inputClass}
              value={form.receiverPhone}
              onChange={(event) =>
                setForm((current) => ({ ...current, receiverPhone: event.target.value }))
              }
              placeholder="Ví dụ: 0912345678"
            />
          </label>
        </div>
        
        <div className="flex flex-col gap-6 mb-8">
          <label className={labelClass}>
            Địa chỉ giao hàng
            <input
              className={inputClass}
              value={form.shippingAddress}
              onChange={(event) =>
                setForm((current) => ({ ...current, shippingAddress: event.target.value }))
              }
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            />
          </label>
          <label className={labelClass}>
            Ghi chú đơn hàng (Tùy chọn)
            <textarea
              className={`${inputClass} resize-none`}
              rows="3"
              value={form.note}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn địa chỉ..."
            />
          </label>
          <label className={labelClass}>
            Phương thức thanh toán
            <select
              className={inputClass}
              value={form.paymentMethod}
              onChange={(event) =>
                setForm((current) => ({ ...current, paymentMethod: event.target.value }))
              }
            >
              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
              <option value="bank_transfer">Chuyển khoản ngân hàng</option>
              <option value="card">Thẻ tín dụng / Thẻ ghi nợ</option>
              <option value="ewallet">Ví điện tử</option>
            </select>
          </label>
        </div>

        {error ? <p className="text-red-500 bg-red-50 px-6 py-4 rounded-xl border border-red-100 font-medium mb-8 text-center">{error}</p> : null}
        
        <div className="pt-6 border-t border-slate-100">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2 cursor-pointer text-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : "Xác nhận đặt hàng"}
          </button>
        </div>
      </form>
    </div>
  );
}
