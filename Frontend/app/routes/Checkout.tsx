import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import { useCart } from "../context/CartContext";
import Nav from "../components/Nav";

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  // Shipping form state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [houseNr, setHouseNr] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Payment status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<number | string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [canceledNotification, setCanceledNotification] = useState(false);

  const subtotal = cart?.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0) || 0;
  const shipping = cart?.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  // Handle return from Stripe (success or canceled)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");

    if (success === "true" && sessionId) {
      setIsVerifying(true);
      setPaymentError(null);

      axios
        .post("/api/Payment/confirm-payment", { sessionId })
        .then((res) => {
          setConfirmedOrderId(res.data.orderId || "OK");
          clearCart();
          // Clean URL query parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error("Payment confirmation failed:", err);
          const errorMsg =
            err.response?.data?.message ||
            err.response?.data ||
            "Zahlung konnte von Stripe nicht verifiziert werden. Es wurde keine Bestellung angelegt.";
          setPaymentError(typeof errorMsg === "string" ? errorMsg : "Zahlungsüberprüfung fehlgeschlagen.");
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else if (canceled === "true") {
      setCanceledNotification(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return;

    setIsSubmitting(true);
    setPaymentError(null);
    setCanceledNotification(false);

    try {
      const itemsPayload = cart.map((item: any) => ({
        productId: Number(item.productId ?? item.id),
        quantity: item.quantity || 1,
      }));

      const response = await axios.post("/api/Payment/create-checkout-session", {
        customerId: 1, // Default customer
        street,
        houseNr: houseNr || "1",
        city,
        zipCode,
        addressType: "Shipping",
        items: itemsPayload,
        successUrl: `${window.location.origin}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout?canceled=true`,
      });

      if (response.data?.url) {
        // Redirect to Stripe Checkout page
        window.location.href = response.data.url;
      } else {
        setPaymentError("Fehler beim Erstellen der Stripe-Zahlungssitzung.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error("Stripe Checkout error:", err);
      const msg = err.response?.data?.error || err.response?.data || "Verbindung zum Zahlungsanbieter fehlgeschlagen.";
      setPaymentError(typeof msg === "string" ? msg : "Fehler bei der Zahlungsabwicklung.");
      setIsSubmitting(false);
    }
  };

  // State: Verifying Stripe payment
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#f2f4f3] font-sans">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-20 sm:px-6 lg:px-8 mt-12 text-center">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#e2e8e4]">
            <div className="w-16 h-16 border-4 border-[#3e564c] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-serif text-[#2a3731] mb-2">Zahlung wird verifiziert...</h2>
            <p className="text-[#8c9490]">Wir überprüfen deine Stripe-Zahlung und erstellen deine Bestellung.</p>
          </div>
        </div>
      </div>
    );
  }

  // State: Order confirmed after successful payment
  if (confirmedOrderId) {
    return (
      <div className="min-h-screen bg-[#f2f4f3] font-sans">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-12 text-center">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#e2e8e4]">
            <div className="w-20 h-20 bg-[#e6efed] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#3e564c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-[#2a3731] mb-2">Zahlung erfolgreich!</h2>
            <p className="text-[#3e564c] font-medium text-lg mb-4">
              Bestellung #{confirmedOrderId} wurde erfolgreich in der Datenbank angelegt.
            </p>
            <p className="text-[#8c9490] mb-8">
              Vielen Dank für deine Bestellung bei Velora. Eine Bestätigung wird in Kürze versandt.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#3e564c] text-white px-8 py-3 rounded hover:bg-[#2a3731] transition duration-300 font-medium tracking-wide uppercase text-sm"
            >
              Weiter shoppen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f3] font-sans">
      <Nav />

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-[#3e564c] mb-8">Kasse (Checkout)</h1>

        {/* Notifications / Alerts */}
        {paymentError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <svg className="w-6 h-6 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Zahlungsfehler / Abbruch</p>
              <p className="text-sm">{paymentError}</p>
            </div>
          </div>
        )}

        {canceledNotification && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
            <svg className="w-6 h-6 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold">Zahlung abgebrochen</p>
              <p className="text-sm">Die Stripe-Zahlung wurde abgebrochen. Es wurde keine Bestellung in der Datenbank erstellt.</p>
            </div>
          </div>
        )}

        {cart?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#e2e8e4]">
            <svg className="w-16 h-16 text-[#8c9490] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-medium text-[#2a3731] mb-2">Dein Warenkorb ist leer</h2>
            <p className="text-[#8c9490] mb-8">Du hast noch keine Produkte zum Warenkorb hinzugefügt.</p>
            <Link to="/products" className="inline-block bg-[#68a49c] text-white px-8 py-3 rounded hover:bg-[#4a857d] transition duration-300 font-medium tracking-wide uppercase text-sm">
              Produkte ansehen
            </Link>
          </div>
        ) : (
          <form onSubmit={handleStripeCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Items & Shipping Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8e4] p-6 sm:p-8">
                <h2 className="text-xl font-medium text-[#2a3731] mb-6">Warenkorb Artikel</h2>
                <ul className="divide-y divide-[#e2e8e4]">
                  {cart?.map((item: any, index: number) => (
                    <li key={item.id || item.productId || index} className="py-6 flex items-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[#f2f4f3] rounded-lg overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-8 h-8 text-[#8c9490]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-6 flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-[#2a3731]">{item.name || "Produkt"}</h3>
                          <p className="text-lg font-medium text-[#2a3731]">€{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2 border border-[#e2e8e4] rounded-lg px-2 py-1 bg-[#f8f9f8]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id || item.productId, (item.quantity || 1) - 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded font-bold transition-colors"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium text-[#2a3731] px-2">{item.quantity || 1}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id || item.productId, (item.quantity || 1) + 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded font-bold transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-sm text-[#c85a5a] hover:text-red-700 font-medium transition-colors cursor-pointer"
                            onClick={() => removeFromCart(item.id || item.productId)}
                          >
                            Entfernen
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8e4] p-6 sm:p-8">
                <h2 className="text-xl font-medium text-[#2a3731] mb-6">Lieferadresse</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#3e564c] mb-1">E-Mail-Adresse *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors"
                      placeholder="kunden@example.com"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#3e564c] mb-1">Vorname *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors"
                      placeholder="Max"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#3e564c] mb-1">Nachname *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors"
                      placeholder="Mustermann"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#3e564c] mb-1">Strasse *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors"
                      placeholder="Hauptstrasse"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#3e564c] mb-1">Hausnummer *</label>
                    <input
                      type="text"
                      required
                      value={houseNr}
                      onChange={(e) => setHouseNr(e.target.value)}
                      className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors"
                      placeholder="10a"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#3e564c] mb-1">PLZ *</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors"
                      placeholder="8000"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-[#3e564c] mb-1">Stadt / Ort *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors"
                      placeholder="Zürich"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8e4] p-6 sm:p-8 sticky top-28">
                <h2 className="text-xl font-medium text-[#2a3731] mb-6">Bestellübersicht</h2>
                <dl className="space-y-4 text-sm text-[#333e38]">
                  <div className="flex justify-between">
                    <dt>Zwischensumme</dt>
                    <dd className="font-medium">€{subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Versandkosten</dt>
                    <dd className="font-medium">€{shipping.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-[#e2e8e4] pt-4 mt-4 text-base font-semibold text-[#2a3731]">
                    <dt>Gesamtsumme</dt>
                    <dd>€{total.toFixed(2)}</dd>
                  </div>
                </dl>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-8 bg-[#3e564c] text-white px-6 py-4 rounded hover:bg-[#2a3731] disabled:opacity-50 transition duration-300 font-medium tracking-wide flex justify-center items-center gap-2 group shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verbinde zu Stripe...</span>
                    </>
                  ) : (
                    <>
                      <span>Mit Stripe bezahlen</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8c9490]">
                  <svg className="w-4 h-4 text-[#68a49c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 00-2-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Sichere Zahlung &amp; Datenübertragung via Stripe
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
