import { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { apiRequest } from "../../lib/api.js";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      const response = await apiRequest("/users", { token });
      setUsers(response.data);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [token]);

  const updateUser = async (user, changes) => {
    try {
      await apiRequest(`/users/${user._id}`, {
        method: "PUT",
        token,
        body: {
          ...user,
          ...changes
        }
      });
      setMessage("User updated");
      loadUsers();
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <section className="grid gap-6">
      <AdminPageHeader title="Users" description="Manage roles and account activation." />
      {message ? <p className="text-green-600 font-medium m-0">{message}</p> : null}
      {error ? <p className="text-red-500 font-medium m-0">{error}</p> : null}
      <section className="bg-white rounded-[24px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5">
        <div className="grid gap-3">
          {users.map((user) => (
            <div key={user._id} className="flex justify-between gap-4 p-4 items-center bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div>
                <strong className="block text-slate-800 mb-1">{user.full_name || user.username}</strong>
                <p className="m-0 text-sm text-slate-500">
                  {user.email} · <span className="font-medium text-slate-700 capitalize">{user.role}</span> ·{" "}
                  <span className={user.isActive ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                    {user.isActive ? "active" : "inactive"}
                  </span>
                </p>
              </div>
              <div className="flex gap-3 items-center shrink-0">
                <select
                  className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 transition-all text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={user.role}
                  onChange={(event) => updateUser(user, { role: event.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer border ${user.isActive ? "text-red-600 bg-red-50 border-red-200 hover:bg-red-100" : "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"}`}
                  onClick={() => updateUser(user, { isActive: !user.isActive })}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
