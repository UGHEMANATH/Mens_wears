import { useState } from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { ShieldCheck, ArrowRight, Truck, Mail } from "lucide-react"

function Checkout() {
    const { cart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const paramState = location.state || {};
    const isSingleCheckout = paramState.singleItemCheckout === true;

    const checkoutItems = isSingleCheckout ? paramState.cartItems : cart;
    const subtotal = isSingleCheckout ? paramState.subtotal : cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = isSingleCheckout ? paramState.shipping : (subtotal > 0 && subtotal < 500 ? 50 : 0);

    // Graded Tax Feature based on Subtotal
    const taxRate = subtotal < 2500 ? 0.05 : 0.18;
    const tax = isSingleCheckout ? paramState.tax : Math.round(subtotal * taxRate);

    const total = isSingleCheckout ? paramState.total : (subtotal + shipping + tax);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        phone: "",
        address: "",
        city: "",
        pincode: ""
    })

    const [paymentMethod, setPaymentMethod] = useState("Card")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        // Pass everything to the payment page to process
        navigate('/payment', {
            state: {
                total,
                subtotal,
                isSingleCheckout,
                cartItems: checkoutItems,
                orderData: { ...formData, paymentMethod, email: user?.email }
            }
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-violet-50 flex flex-col font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full flex-grow">
                <h1 className="text-3xl font-extrabold text-violet-950 mb-8 border-b-2 border-violet-100 pb-4">
                    Checkout
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Shipping Form */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-violet-950 mb-6 flex items-center gap-2">
                                <Truck className="text-emerald-500" /> Shipping Information
                            </h2>

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-violet-900 mb-2">Account Email</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-500">
                                                <Mail size={16} />
                                            </span>
                                            <input type="email" value={user?.email || "Guest"} disabled className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl pl-10 px-4 py-3 outline-none font-bold cursor-not-allowed" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-violet-900 mb-2">Full Name</label>
                                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-violet-50 border border-violet-200 text-violet-900 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium uppercase placeholder:normal-case placeholder:text-violet-300" placeholder="e.g. JOHN DOE" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-violet-900 mb-2">Phone Number</label>
                                        <input required type="tel" pattern="[0-9]{10}" title="Must be exactly 10 digits" maxLength={10} name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-violet-50 border border-violet-200 text-violet-900 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium placeholder:text-violet-300" placeholder="10 Digit Number" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-violet-900 mb-2">Street Address</label>
                                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-violet-50 border border-violet-200 text-violet-900 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium" placeholder="123 Main St, Apartment 4B" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-violet-900 mb-2">City</label>
                                        <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-violet-50 border border-violet-200 text-violet-900 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium" placeholder="Mumbai" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-violet-900 mb-2">Pincode</label>
                                        <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-violet-50 border border-violet-200 text-violet-900 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium" placeholder="400001" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-6 sm:p-8 mt-8">
                            <h2 className="text-xl font-bold text-violet-950 mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-emerald-500" /> Payment Method
                            </h2>
                            <div className="space-y-4">
                                {["Card", "UPI", "Cash on Delivery"].map((method) => (
                                    <label key={method} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === method ? 'border-emerald-500 bg-emerald-50' : 'border-violet-100 hover:border-violet-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={paymentMethod === method}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-5 h-5 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="font-semibold text-violet-950">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <Link to="/cart" className="text-violet-600 hover:text-emerald-500 font-bold flex items-center gap-2 transition-colors">
                                Return to Cart
                            </Link>
                            <Link to="/" className="text-violet-600 hover:text-emerald-500 font-bold transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-6 sm:p-8 sticky top-32">
                            <h2 className="text-xl font-bold text-violet-950 mb-6 pb-4 border-b border-violet-100">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {checkoutItems.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-violet-50 rounded-lg p-1" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-violet-900 text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-violet-500 text-xs mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-violet-950">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-violet-600 text-sm border-t border-violet-100 pt-4">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span>{shipping === 0 ? <span className="text-emerald-500 font-bold">Free</span> : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax ({subtotal < 2500 ? '5%' : '18%'} GST):</span>
                                    <span className="font-semibold">₹{tax}</span>
                                </div>

                                <div className="border-t border-violet-100 pt-4 mt-4 flex justify-between items-center bg-violet-50 p-4 rounded-2xl">
                                    <span className="text-lg font-bold text-violet-950">Total Pay:</span>
                                    <span className="text-2xl font-extrabold text-emerald-600">₹{total}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={checkoutItems.length === 0}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98]"
                                >
                                    Proceed to Payment <ArrowRight size={20} />
                                </button>
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-violet-400">
                                <ShieldCheck size={16} /> Payments are secure and encrypted
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Checkout
