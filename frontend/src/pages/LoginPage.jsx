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
    <section className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-[600px] bg-gradient-to-tr from-brand-primary/5 via-transparent to-blue-500/5 blur-3xl -z-10 rounded-full pointer-events-none"></div>
      
      <form className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 w-full max-w-md relative z-10" onSubmit={handleSubmit}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Đăng nhập</h2>
          <p className="text-slate-500 text-sm">Sử dụng tài khoản demo hoặc tài khoản bạn đã đăng ký.</p>
        </div>
        
        <label className="flex flex-col gap-2 font-medium text-slate-700 text-[0.95rem] mb-5">
          Email
          <input
            className="border border-slate-200 rounded-xl px-4 py-3.5 bg-slate-50/50 text-slate-900 transition-all focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none w-full"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Nhập email của bạn"
          />
        </label>
        
        <label className="flex flex-col gap-2 font-medium text-slate-700 text-[0.95rem] mb-6">
          Mật khẩu
          <input
            className="border border-slate-200 rounded-xl px-4 py-3.5 bg-slate-50/50 text-slate-900 transition-all focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none w-full"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Nhập mật khẩu"
          />
        </label>
        
        {error ? <p className="text-red-500 text-sm font-medium mb-5 text-center bg-red-50 py-2.5 rounded-xl border border-red-100">{error}</p> : null}
        
        <button 
          className="w-full px-6 py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-black border-none cursor-pointer transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang đăng nhập...
            </>
          ) : "Đăng nhập"}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Chưa có tài khoản? <button type="button" onClick={() => navigate('/register')} className="text-brand-primary font-bold hover:underline bg-transparent border-none p-0 cursor-pointer">Đăng ký ngay</button>
          </p>
        </div>
      </form>
    </section>
  );
}
