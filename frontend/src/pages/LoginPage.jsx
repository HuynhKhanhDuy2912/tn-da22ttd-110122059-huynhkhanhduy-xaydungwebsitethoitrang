import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "demo@fashionstore.com",
    password: "123456"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate(location.state?.from || "/products", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-white">
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-black mb-2 tracking-widest uppercase">ĐĂNG NHẬP</h2>
          <p className="text-gray-500 text-sm">Sử dụng tài khoản demo hoặc tài khoản bạn đã đăng ký.</p>
        </div>
        
        <label className="flex flex-col gap-2 font-bold text-black text-xs uppercase tracking-widest mb-6">
          EMAIL
          <input
            className="border-b border-gray-300 rounded-none px-0 py-2.5 bg-transparent text-black transition-colors focus:border-black focus:outline-none w-full"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Nhập email của bạn"
          />
        </label>
        
        <label className="flex flex-col gap-2 font-bold text-black text-xs uppercase tracking-widest mb-8">
          MẬT KHẨU
          <input
            className="border-b border-gray-300 rounded-none px-0 py-2.5 bg-transparent text-black transition-colors focus:border-black focus:outline-none w-full"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Nhập mật khẩu"
          />
        </label>
        
        {error ? <p className="text-red-500 text-sm font-bold mb-6 text-center border border-red-500 py-3">{error}</p> : null}
        
        <button 
          className="w-full px-6 py-4 font-bold text-white bg-black hover:bg-gray-800 border border-black cursor-pointer transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 uppercase tracking-widest text-sm"
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ĐANG ĐĂNG NHẬP...
            </>
          ) : "ĐĂNG NHẬP"}
        </button>

        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            CHƯA CÓ TÀI KHOẢN? <button type="button" onClick={() => navigate('/register')} className="text-black font-extrabold hover:underline bg-transparent border-none p-0 cursor-pointer uppercase ml-1">ĐĂNG KÝ NGAY</button>
          </p>
        </div>
      </form>
    </section>
  );
}
