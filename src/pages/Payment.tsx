import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, ShieldCheck } from "lucide-react"

export default function Payment() {
    const location = useLocation()
    const navigate = useNavigate()
    const { clearCart } = useCart()
    const [status, setStatus] = useState<"processing" | "success" | "error">("processing")

    // State passed from checkout
    const { total, cartItems, orderData } = location.state || {}

    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            navigate('/')
            return
        }

        // Simulate Payment Processing
        const processPayment = setTimeout(() => {
            // Create Order
            const newOrder = {
                orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
                date: new Date().toISOString(),
                total,
                items: cartItems,
                shippingInfo: orderData
            }

            // Save Order to LocalStorage
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
            localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]))

            // Switch to success status
            setStatus("success")
            clearCart()

            // Redirect after showing success animation for 3 seconds
            setTimeout(() => {
                navigate('/orders')
            }, 3000)

        }, 2500)

        return () => clearTimeout(processPayment)
    }, [cartItems, navigate, clearCart, orderData, total])

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
