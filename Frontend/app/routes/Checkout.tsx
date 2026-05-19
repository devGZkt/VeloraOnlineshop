import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import Nav from "../components/Nav";

const Checkout = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);

    const subtotal = cart?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0;
    const shipping = cart?.length > 0 ? 5.99 : 0;
    const total = subtotal + shipping;

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setOrderPlaced(true);
        clearCart();
    };

    if (orderPlaced) {
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
                        <h2 className="text-3xl font-serif text-[#2a3731] mb-4">Thank you for your order!</h2>
                        <p className="text-[#8c9490] mb-8">We've received your order and will contact you as soon as your package is shipped.</p>
                        <Link to="/products" className="inline-block bg-[#3e564c] text-white px-8 py-3 rounded hover:bg-[#2a3731] transition duration-300 font-medium tracking-wide uppercase text-sm">
                            Continue Shopping
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
                <h1 className="text-4xl font-serif text-[#3e564c] mb-10">Checkout</h1>

                {cart?.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#e2e8e4]">
                        <svg className="w-16 h-16 text-[#8c9490] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2 className="text-2xl font-medium text-[#2a3731] mb-2">Your cart is empty</h2>
                        <p className="text-[#8c9490] mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/products" className="inline-block bg-[#68a49c] text-white px-8 py-3 rounded hover:bg-[#4a857d] transition duration-300 font-medium tracking-wide uppercase text-sm">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Order Items */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8e4] p-6 sm:p-8">
                                <h2 className="text-xl font-medium text-[#2a3731] mb-6">Order Items</h2>
                                <ul className="divide-y divide-[#e2e8e4]">
                                    {cart?.map((item: any, index: number) => (
                                        <li key={item.id || index} className="py-6 flex items-center">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-[#f2f4f3] rounded-lg overflow-hidden flex items-center justify-center">
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
                                                    <h3 className="text-lg font-medium text-[#2a3731]">{item.name || "Unknown Product"}</h3>
                                                    <p className="text-lg font-medium text-[#2a3731]">${(item.price || 0).toFixed(2)}</p>
                                                </div>
                                                <p className="text-sm text-[#8c9490] mt-1">Quantity: 1</p>
                                                <div className="mt-2 text-sm text-[#c85a5a] cursor-pointer hover:text-red-700 font-medium transition-colors" onClick={() => removeFromCart(item.id)}>
                                                    Remove
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Shipping Details */}
                            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8e4] p-6 sm:p-8">
                                <h2 className="text-xl font-medium text-[#2a3731] mb-6">Shipping Information</h2>
                                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[#3e564c] mb-1">Email address</label>
                                        <input type="email" required className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors !text-[#2a3731]" placeholder="you@example.com" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-[#3e564c] mb-1">First name</label>
                                        <input type="text" required className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors !text-[#2a3731]" placeholder="Jane" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-[#3e564c] mb-1">Last name</label>
                                        <input type="text" required className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors !text-[#2a3731]" placeholder="Doe" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-[#3e564c] mb-1">Address</label>
                                        <input type="text" required className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors !text-[#2a3731]" placeholder="123 Main St" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-[#3e564c] mb-1">City</label>
                                        <input type="text" required className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors !text-[#2a3731]" placeholder="New York" />
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-[#3e564c] mb-1">Postal code</label>
                                        <input type="text" required className="w-full border-[#e2e8e4] rounded-md shadow-sm focus:ring-[#68a49c] focus:border-[#68a49c] px-4 py-2 border outline-none transition-colors !text-[#2a3731]" placeholder="10001" />
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-5 relative">
                            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8e4] p-6 sm:p-8 sticky top-28">
                                <h2 className="text-xl font-medium text-[#2a3731] mb-6">Order Summary</h2>
                                <dl className="space-y-4 text-sm text-[#333e38]">
                                    <div className="flex justify-between">
                                        <dt>Subtotal</dt>
                                        <dd className="font-medium">${subtotal.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt>Shipping</dt>
                                        <dd className="font-medium">${shipping.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt>Tax</dt>
                                        <dd className="font-medium text-[#8c9490]">Calculated at next step</dd>
                                    </div>
                                    <div className="flex justify-between border-t border-[#e2e8e4] pt-4 mt-4 text-base font-medium text-[#2a3731]">
                                        <dt>Total</dt>
                                        <dd>${total.toFixed(2)}</dd>
                                    </div>
                                </dl>

                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full mt-8 bg-[#3e564c] text-white px-6 py-4 rounded hover:bg-[#2a3731] transition duration-300 font-medium tracking-wide flex justify-center items-center gap-2 group shadow-md"
                                >
                                    Place Order
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#8c9490]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 00-2-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Secure checkout via Stripe Payments
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ); };

export default Checkout;
