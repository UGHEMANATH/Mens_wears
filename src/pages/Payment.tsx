import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, ShieldCheck } from "lucide-react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Payment() {
    const location = useLocation()
    const navigate = useNavigate()
    const { clearCart } = useCart()
    const { user } = useAuth()
    const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
    const [errorMsg, setErrorMsg] = useState("")

    // State passed from checkout
    const { total, cartItems, orderData } = location.state || {}

    useEffect(() => {
        if (!cartItems || cartItems.length === 0 || !user) {
            navigate('/')
            return
        }

        const processPayment = async () => {
            try {
                // Map CartItems to Backend Order Schema format
                const orderItemsMapped = cartItems.map((item: any) => ({
                    product: item.id || item.product,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    qty: item.quantity
                }))

                // Construct final payload
                const finalOrder = {
                    orderItems: orderItemsMapped,
                    shippingAddress: {
                        address: orderData.address,
                        city: orderData.city,
                        postalCode: orderData.pincode,
                        country: "Default Country"
                    },
                    paymentMethod: orderData.paymentMethod || "Credit Card",
                    itemsPrice: total - (total * 0.18) - 50, // rough math reversing for mock subtotal
                    taxPrice: total * 0.18,
                    shippingPrice: 50,
                    totalPrice: total,
                }

                // POST to MongoDB Backend
                await axios.post(`${API_URL}/api/orders`, finalOrder, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })

                setStatus("success")
                clearCart() // Will trigger clear both via API and React state internally

                setTimeout(() => {
                    navigate('/orders')
                }, 3000)

            } catch (error: any) {
                console.error("Order processing failed", error)
                setStatus("error")
                setErrorMsg(error.response?.data?.message || "Payment Processing Failed. Try again.")
            }
        }

        processPayment()

    }, [cartItems, navigate, clearCart, orderData, total, user])

    return (
        <div className="min-h-screen flex items-center justify-center bg-violet-50 dark:bg-slate-900 transition-colors p-4">
            <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl shadow-xl w-full max-w-md text-center border border-violet-100 dark:border-slate-700">

                {status === "processing" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center"
                    >
                        <Loader2 size={64} className="text-emerald-500 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-violet-950 dark:text-white mb-2">Processing Payment</h2>
                        <p className="text-violet-500 dark:text-slate-400 mb-6">Please do not close or refresh this window.</p>

                        <div className="bg-violet-50 dark:bg-slate-700/50 rounded-xl p-4 w-full">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-violet-600 dark:text-slate-300">Amount</span>
                                <span className="text-violet-950 dark:text-white font-bold tracking-wider">₹{total}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium mt-2">
                                <span className="text-violet-600 dark:text-slate-300">Method</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{orderData?.paymentMethod}</span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-violet-400 dark:text-slate-500">
                            <ShieldCheck size={16} /> Secure 256-bit encryption
                        </div>
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Transaction Failed</h2>
                        <p className="text-red-400 mb-6">{errorMsg}</p>
                        <button onClick={() => navigate('/cart')} className="bg-violet-100 text-violet-900 font-bold py-2 px-6 rounded-xl hover:bg-violet-200">Return to Cart</button>
                    </motion.div>
                )}

                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="flex flex-col items-center"
                    >
                        <CheckCircle size={80} className="text-emerald-500 mb-6" />
                        <h2 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-2">Payment Successful!</h2>
                        <p className="text-violet-950 dark:text-white font-bold text-lg mb-2">Order Confirmed</p>
                        <p className="text-violet-500 dark:text-slate-400 mb-8 max-w-xs">We've received your order and are getting it ready to be shipped.</p>

                        <p className="text-sm font-medium text-emerald-500 animate-pulse">Redirecting to your orders...</p>
                    </motion.div>
                )}

            </div>
        </div>
    )
}
