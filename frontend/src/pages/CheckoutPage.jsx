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

  return (
    <section>
      <PageHeader
        title="Checkout"
        description="Create an order from the current cart."
      />
      <form className="card form-grid" onSubmit={handleSubmit}>
        <label>
          Receiver name
          <input
            value={form.receiverName}
            onChange={(event) =>
              setForm((current) => ({ ...current, receiverName: event.target.value }))
            }
          />
        </label>
        <label>
          Receiver phone
          <input
            value={form.receiverPhone}
            onChange={(event) =>
              setForm((current) => ({ ...current, receiverPhone: event.target.value }))
            }
          />
        </label>
        <label className="full-width">
          Shipping address
          <input
            value={form.shippingAddress}
            onChange={(event) =>
              setForm((current) => ({ ...current, shippingAddress: event.target.value }))
            }
          />
        </label>
        <label className="full-width">
          Note
          <textarea
            rows="4"
            value={form.note}
            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
          />
        </label>
        <label>
          Payment method
          <select
            value={form.paymentMethod}
            onChange={(event) =>
              setForm((current) => ({ ...current, paymentMethod: event.target.value }))
            }
          >
            <option value="cod">Cash on delivery</option>
            <option value="bank_transfer">Bank transfer</option>
            <option value="card">Card</option>
            <option value="ewallet">E-wallet</option>
          </select>
        </label>
        {error ? <p className="error-text full-width">{error}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? "Creating order..." : "Place order"}
        </button>
      </form>
    </section>
  );
}
