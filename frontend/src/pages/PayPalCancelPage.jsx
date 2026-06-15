import { useEffect } from "react";

export default function PayPalCancelPage() {
  useEffect(() => {
    const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const cancelUrl = `${backendBaseUrl}/payment/paypal/cancel${window.location.search}`;
    window.location.replace(cancelUrl);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-base font-medium text-gray-800">Đang xử lý giao dịch...</p>
        <p className="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát.</p>
      </div>
    </div>
  );
}
