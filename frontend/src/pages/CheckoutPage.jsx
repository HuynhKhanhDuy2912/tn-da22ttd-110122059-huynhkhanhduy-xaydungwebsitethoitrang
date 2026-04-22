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

  const inputClass = "border-b border-gray-300 rounded-none px-0 py-2.5 bg-transparent text-black transition-colors focus:border-black focus:outline-none w-full text-sm";
  const labelClass = "flex flex-col gap-2 font-bold text-black text-xs uppercase tracking-widest";

  return (
    <div className="px-4 md:px-0 py-8 max-w-3xl mx-auto">
      <PageHeader
        title="THANH TOÁN"
        description="ĐIỀN THÔNG TIN ĐỂ HOÀN TẤT ĐƠN HÀNG CỦA BẠN."
      />
      <form className="bg-white border border-gray-200 p-8 md:p-10 mt-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <label className={labelClass}>
            TÊN NGƯỜI NHẬN
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
            SỐ ĐIỆN THOẠI
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
        
        <div className="flex flex-col gap-8 mb-10">
          <label className={labelClass}>
            ĐỊA CHỈ GIAO HÀNG
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
            GHI CHÚ ĐƠN HÀNG (TÙY CHỌN)
            <textarea
              className={`${inputClass} resize-none`}
              rows="3"
              value={form.note}
              onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
              placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn địa chỉ..."
            />
          </label>
          <label className={labelClass}>
            PHƯƠNG THỨC THANH TOÁN
            <div className="relative">
              <select
                className={`${inputClass} appearance-none`}
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
              <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </label>
        </div>

        {error ? <p className="text-red-500 bg-red-50 px-6 py-4 border border-red-100 font-bold mb-8 text-center text-sm">{error}</p> : null}
        
        <div className="pt-8 border-t border-gray-200">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer uppercase tracking-widest text-xs"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ĐANG XỬ LÝ...
              </>
            ) : "XÁC NHẬN ĐẶT HÀNG"}
          </button>
        </div>
      </form>
    </div>
  );
}
