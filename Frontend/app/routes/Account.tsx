import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Nav from "../components/Nav";
import { useAuth } from "../context/AuthContext";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  type: string | null;
  street: string;
  houseNr: string;
  city: string;
  zipCode: string;
  items: OrderItem[];
  total: number;
}

const Account = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/signin");
      return;
    }

    axios
      .get("/api/Orders/my", { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch(() => setError("Bestellungen konnten nicht geladen werden."));
  }, [isLoading, user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#f2f4f3] font-sans">
        <Nav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f3] font-sans">
      <Nav />
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-[#3e564c] mb-2">Mein Konto</h1>
        <p className="text-[#8c9490] mb-10">
          Willkommen zurück, {user.firstName}. Hier findest du deine bisherigen Bestellungen.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {orders === null && !error ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#e2e8e4] text-[#8c9490]">
            Bestellungen werden geladen...
          </div>
        ) : orders && orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#e2e8e4]">
            <h2 className="text-2xl font-medium text-[#2a3731] mb-2">Noch keine Bestellungen</h2>
            <p className="text-[#8c9490] mb-8">Du hast bisher noch keine Bestellung aufgegeben.</p>
            <Link
              to="/products"
              className="inline-block bg-[#68a49c] text-white px-8 py-3 rounded hover:bg-[#4a857d] transition duration-300 font-medium tracking-wide uppercase text-sm"
            >
              Produkte ansehen
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl shadow-sm border border-[#e2e8e4] p-6 sm:p-8"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-[#e2e8e4]">
                  <div>
                    <p className="text-sm text-[#8c9490]">Bestellung #{order.orderId}</p>
                    <p className="text-lg font-medium text-[#2a3731]">
                      {new Date(order.orderDate).toLocaleDateString("de-CH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#8c9490]">Gesamtsumme</p>
                    <p className="text-lg font-semibold text-[#2a3731]">€{order.total.toFixed(2)}</p>
                  </div>
                </div>

                <ul className="divide-y divide-[#e2e8e4]">
                  {order.items.map((item) => (
                    <li key={item.productId} className="py-3 flex justify-between text-sm">
                      <span className="text-[#333e38]">
                        {item.productName}{" "}
                        <span className="text-[#8c9490]">× {item.quantity}</span>
                      </span>
                      <span className="font-medium text-[#2a3731]">
                        €{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-[#8c9490] mt-4">
                  Lieferadresse: {order.street} {order.houseNr}, {order.zipCode} {order.city}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
