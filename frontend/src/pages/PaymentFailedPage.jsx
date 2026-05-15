import { Link, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white border-2 border-red-500 p-8 text-center">
        <div className="mb-6 flex justify-center">
          <XCircle className="h-20 w-20 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-black mb-3 uppercase tracking-widest">
          THANH TOÁN THẤT BẠI
        </h1>

        <p className="text-gray-600 mb-6 text-sm">
          {message || "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác."}
        </p>

        {orderId && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6">
            <p className="text-xs text-red-600 uppercase tracking-widest mb-1">MÃ ĐƠN HÀNG</p>
            <p className="text-lg font-bold text-red-700">#{orderId.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-red-600 mt-2">Đơn hàng vẫn được lưu với trạng thái chờ thanh toán</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {orderId && (
            <Link
              to="/orders"
              className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              XEM ĐƠN HÀNG & THỬ LẠI
            </Link>
          )}

          <Link
            to="/cart"
            className="flex items-center justify-center gap-2 bg-white text-black border border-black px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            QUAY LẠI GIỎ HÀNG
          </Link>

          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-black transition-colors uppercase tracking-wider"
          >
            Về trang chủ
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">CẦN HỖ TRỢ?</p>
          <p className="text-sm text-gray-600">
            Liên hệ: <a href="tel:1900xxxx" className="text-black font-bold hover:underline">1900 xxxx</a>
          </p>
        </div>
      </div>
    </div>
  );
}
