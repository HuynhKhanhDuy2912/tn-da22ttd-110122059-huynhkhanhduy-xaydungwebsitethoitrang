import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  IdCard,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";
import { getAvatarInitial, getUserDisplayName } from "../../lib/avatar.js";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ProviderBadge({ provider }) {
  const labelMap = {
    email: "Email",
    google: "Google",
    firebase_phone: "Số điện thoại",
    phone: "Số điện thoại",
  };

  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
      {labelMap[provider] || provider}
    </span>
  );
}

export default function AdminAccountPage() {
  const { user, token, refreshMe } = useAuth();
  const [profileForm, setProfileForm] = useState({
    fullname: "",
    phone_number: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const canChangePassword = user?.authProviders?.includes("email");
  const displayName = getUserDisplayName(user, "Admin");

  const passwordStrength = useMemo(() => {
    const value = passwordForm.newPassword;
    let score = 0;
    if (value.length >= 6) score += 1;
    if (value.length >= 10) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    if (!value) return { label: "Chưa nhập", width: "0%", tone: "bg-slate-200" };
    if (score <= 2) return { label: "Cơ bản", width: "40%", tone: "bg-amber-500" };
    if (score <= 4) return { label: "Tốt", width: "72%", tone: "bg-blue-500" };
    return { label: "Mạnh", width: "100%", tone: "bg-emerald-500" };
  }, [passwordForm.newPassword]);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      fullname: user.fullname || "",
      phone_number: (user.phone_number || "").replace(/^\+84/, "0"),
    });
  }, [user]);

  useEffect(() => {
    if (!success && !error) return undefined;
    const timer = window.setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [success, error]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPassword({
      current: false,
      next: false,
      confirm: false,
    });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleCancelPasswordChange = () => {
    resetPasswordForm();
    setIsPasswordFormOpen(false);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    setSuccess("");
    setError("");

    try {
      await apiRequest("/auth/profile", {
        method: "PUT",
        token,
        body: {
          fullname: profileForm.fullname.trim(),
          phone_number: profileForm.phone_number.trim(),
        },
      });
      await refreshMe();
      setSuccess("Cập nhật thông tin quản trị viên thành công.");
    } catch (requestError) {
      setError(requestError.message || "Không thể cập nhật tài khoản.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!canChangePassword) {
      setError("Tài khoản này không đăng nhập bằng email/mật khẩu.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setSavingPassword(true);

    try {
      await apiRequest("/auth/change-password", {
        method: "PUT",
        token,
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      });
      resetPasswordForm();
      setIsPasswordFormOpen(false);
      setSuccess("Đổi mật khẩu quản trị thành công.");
    } catch (requestError) {
      setError(requestError.message || "Không thể đổi mật khẩu.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Cài đặt quản trị
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">
            Thông tin tài khoản
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Quản lý nhận diện người vận hành, thông tin liên hệ nội bộ và bảo mật đăng nhập.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Quyền quản trị viên
        </div>
      </header>

      {(success || error) ? (
        <div
          className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
          <span>{error || success}</span>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
        <div className="space-y-6">
          <section className="min-h-[470px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:min-h-[410px]">
            <div className="bg-slate-950 px-6 py-8 text-white">
              <div className="flex items-center gap-4">
                <div className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-2xl font-bold uppercase">
                  {getAvatarInitial(user, "A")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{displayName}</p>
                  <p className="mt-1 truncate text-sm text-white/60">
                    {user.email || "Chưa có email"}
                  </p>
                  <div className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                    Admin FashionStore
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100 p-6">
              <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <span className="text-sm text-slate-500">Mã tài khoản</span>
                <span className="truncate text-sm font-semibold text-slate-900">
                  {user._id ? String(user._id).slice(-8).toUpperCase() : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-slate-500">Ngày tạo</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-slate-500">Cập nhật gần nhất</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatDate(user.updatedAt)}
                </span>
              </div>
              <div className="py-3 last:pb-0">
                <span className="text-sm text-slate-500">Phương thức đăng nhập</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(user.authProviders?.length ? user.authProviders : ["email"]).map((provider) => (
                    <ProviderBadge key={provider} provider={provider} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="min-h-[470px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:min-h-[410px]">
            <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Hồ sơ quản trị viên</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Cập nhật thông tin hiển thị trong khu vực quản trị.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <User className="h-4 w-4 text-slate-400" />
                    Họ tên quản trị viên
                  </span>
                  <input  
                    type="text"
                    name="fullname"
                    value={profileForm.fullname}
                    onChange={handleProfileChange}
                    placeholder="Nhập họ tên"
                    className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-950"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Phone className="h-4 w-4 text-slate-400" />
                    Số điện thoại nội bộ
                  </span>
                  <input
                    type="tel"
                    name="phone_number"
                    value={profileForm.phone_number}
                    onChange={handleProfileChange}
                    placeholder="0901 234 567"
                    className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-950"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400" />
                    Email đăng nhập
                  </span>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <IdCard className="h-4 w-4 text-slate-400" />
                    Vai trò hệ thống
                  </span>
                  <input
                    type="text"
                    value="Quản trị viên"
                    disabled
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {canChangePassword && !isPasswordFormOpen ? (
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setSuccess("");
                        setIsPasswordFormOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                    >
                      <KeyRound className="h-4 w-4" />
                      Đổi mật khẩu
                    </button>
                  ) : null}
                </div>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Lưu thông tin
                </button>
              </div>
            </form>

            {canChangePassword ? (
              isPasswordFormOpen ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <div className="mb-5 flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-950 text-white">
                        <KeyRound className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-950">Đổi mật khẩu</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Cập nhật mật khẩu đăng nhập cho tài khoản quản trị.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    {[
                      {
                        key: "current",
                        name: "currentPassword",
                        label: "Mật khẩu hiện tại",
                        value: passwordForm.currentPassword,
                        visible: showPassword.current,
                      },
                      {
                        key: "next",
                        name: "newPassword",
                        label: "Mật khẩu mới",
                        value: passwordForm.newPassword,
                        visible: showPassword.next,
                      },
                      {
                        key: "confirm",
                        name: "confirmPassword",
                        label: "Xác nhận mật khẩu",
                        value: passwordForm.confirmPassword,
                        visible: showPassword.confirm,
                      },
                    ].map((field) => (
                      <label key={field.name} className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">
                          {field.label}
                        </span>
                        <span className="relative block">
                          <input
                            type={field.visible ? "text" : "password"}
                            name={field.name}
                            value={field.value}
                            onChange={handlePasswordChange}
                            className="h-11 w-full rounded-lg border border-slate-200 px-4 pr-11 text-sm outline-none transition focus:border-slate-950"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((current) => ({
                                ...current,
                                [field.key]: !current[field.key],
                              }))
                            }
                            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label={field.visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          >
                            {field.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wide text-slate-500">
                        Độ mạnh mật khẩu
                      </span>
                      <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${passwordStrength.tone}`}
                        style={{ width: passwordStrength.width }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-2 border-t border-slate-100 pt-5 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      disabled={savingPassword}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={
                        savingPassword ||
                        !passwordForm.currentPassword ||
                        !passwordForm.newPassword ||
                        !passwordForm.confirmPassword
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Đổi mật khẩu
                    </button>
                  </div>
                </form>
              ) : null
            ) : (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                Tài khoản admin này không đăng nhập bằng email/mật khẩu nên không thể đổi mật khẩu tại đây.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
