import { Inbox, Mail, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

function formatTimeAgo(value) {
  if (!value) return "Vừa xong";

  const date = new Date(value);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;

  return `${Math.floor(diffHour / 24)} ngày trước`;
}

export default function AdminContactInboxButton() {
  const navigate = useNavigate();
  const { token } = useAuth() || {};
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [messages],
  );

  const loadInbox = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [countResponse, listResponse] = await Promise.all([
        apiRequest("/contact/unread-count", { token }),
        apiRequest("/contact?limit=8", { token }),
      ]);
      setUnreadCount(countResponse.data?.unreadCount || 0);
      setMessages(listResponse.data || []);
    } catch (_error) {
      setMessages([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();

    const interval = window.setInterval(loadInbox, 30000);
    window.addEventListener("contact:changed", loadInbox);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("contact:changed", loadInbox);
    };
  }, [token]);

  const handleNavigate = async (message) => {
    if (!message) return;

    if (!message.isRead) {
      try {
        await apiRequest(`/contact/${message._id}/read`, {
          method: "PATCH",
          token,
        });
      } catch (_error) {
        /* still navigate */
      }
    }

    setIsOpen(false);
    navigate(`/admin/contact-messages/${message._id}`);
  };

  const handleDelete = async (item) => {
    if (!item || isDeleting) return;

    if (!item.isRead) {
      setPendingDelete(item);
      return;
    }

    try {
      setIsDeleting(true);
      await apiRequest(`/contact/${item._id}`, {
        method: "DELETE",
        token,
      });
      loadInbox();
    } catch (error) {
      // Ignore error for now, maybe add toast later
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteUnread = async () => {
    if (!pendingDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      await apiRequest(`/contact/${pendingDelete._id}`, {
        method: "DELETE",
        token,
      });
      setPendingDelete(null);
      loadInbox();
    } catch (error) {
      // Ignore error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setPendingDelete(null);
          setIsOpen((current) => !current);
          if (!isOpen) loadInbox();
        }}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-black hover:text-black"
        aria-label="Tin nhắn liên hệ"
        title="Tin nhắn liên hệ"
      >
        <Mail className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-[3px] -top-[3px] grid min-h-5 min-w-5 place-items-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Đóng hộp thư"
            className="fixed inset-0 z-30 cursor-default bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-12 z-40 w-[380px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <h3 className="text-sm font-bold text-black">Tin nhắn liên hệ</h3>
                <p className="mt-0.5 text-xs text-gray-500">{unreadCount} tin chưa đọc</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/admin/contact-messages");
                }}
                className="text-xs font-medium text-blue-600 transition hover:text-blue-800"
              >
                Xem tất cả
              </button>
            </div>

            <div className={`overflow-y-auto ${sortedMessages.length > 5 ? "max-h-[360px]" : ""}`}>
              {loading && sortedMessages.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">Đang tải hộp thư...</div>
              ) : sortedMessages.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">Chưa có tin nhắn liên hệ</div>
              ) : (
                sortedMessages.map((item) => (
                  <div
                    key={item._id}
                    className={`flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                      item.isRead ? "bg-white" : "bg-blue-50/50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavigate(item)}
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                    >
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-700">
                        <Inbox className="h-4 w-4" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="mb-0.5 flex items-center gap-2">
                          <span className="truncate text-xs font-semibold text-black">
                            {item.fullName || "Khách hàng"}
                          </span>
                          <span className="shrink-0 text-[11px] text-gray-400">{formatTimeAgo(item.createdAt)}</span>
                        </span>
                        <span className="block truncate text-xs font-medium text-gray-700">
                          {item.ticketCode} - {item.topic}
                        </span>
                        <span className="line-clamp-2 block text-xs text-gray-500">{item.message}</span>
                      </span>
                    </button>

                    <div className="flex shrink-0 items-start gap-2">
                      {!item.isRead ? <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" /> : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={isDeleting}
                        className="grid h-8 w-8 place-items-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Xóa tin nhắn"
                        title="Xóa tin nhắn"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {pendingDelete ? (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 px-4">
              <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
                <h4 className="text-sm font-bold text-black">Xóa tin nhắn chưa đọc?</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Bạn có muốn xóa tin nhắn này không?
                </p>
                <p className="mt-3 line-clamp-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  {pendingDelete.message}
                </p>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingDelete(null)}
                    disabled={isDeleting}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteUnread}
                    disabled={isDeleting}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? "Đang xóa..." : "Xóa"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
