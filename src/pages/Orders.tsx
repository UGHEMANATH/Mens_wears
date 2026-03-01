import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/AuthContext"
import { Package } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface OrderRecord {
    _id: string; // Mongo ID Maps directly to OrderId
    createdAt: string;
    totalPrice: number;
    orderItems: Array<{
        product: string;
        name: string;
        price: number;
        qty: number;
        image: string;
    }>;
}

function Orders() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<OrderRecord[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return
            setLoading(true)
            try {
                const { data } = await axios.get(`${API_URL}/api/orders/myorders`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
                setOrders(data)
            } catch (error) {
                console.error("Failed to fetch mongo orders", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user])

    return (
        <div className="min-h-screen bg-violet-50 dark:bg-slate-900 font-sans flex flex-col transition-colors">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
                <h1 className="text-3xl font-extrabold text-violet-950 dark:text-white mb-8 border-b-2 border-violet-100 dark:border-slate-700 pb-4">
                    Your Orders
                </h1>

                {loading ? (
                    <div className="text-center py-20 text-violet-500 font-bold">Loading your live MongoDB orders...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-violet-100 dark:border-slate-700 p-16 text-center flex flex-col items-center justify-center">
                        <div className="bg-violet-50 dark:bg-slate-700 p-6 rounded-full inline-block mb-6 text-violet-400 dark:text-slate-400">
                            <Package size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-violet-900 dark:text-white mb-4">No orders yet</h2>
                        <p className="text-violet-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Looks like you haven't placed any orders yet. Start exploring our collections!</p>
                        <Link to="/" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.slice().reverse().map(order => (
                            <div key={order._id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-violet-100 dark:border-slate-700 overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-violet-50 dark:bg-slate-700/50 p-4 sm:p-6 border-b border-violet-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex flex-wrap gap-6 sm:gap-12 text-sm">
                                        <div>
                                            <p className="text-violet-500 dark:text-slate-400 font-medium mb-1">ORDER PLACED</p>
                                            <p className="font-bold text-violet-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-violet-500 dark:text-slate-400 font-medium mb-1">TOTAL</p>
                                            <p className="font-bold text-violet-900 dark:text-white">₹{order.totalPrice}</p>
                                        </div>
                                        <div>
                                            <p className="text-violet-500 dark:text-slate-400 font-medium mb-1">ORDER #</p>
                                            <p className="font-bold text-violet-900 dark:text-white">{order._id}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-4 sm:p-6">
                                    <h3 className="font-bold text-emerald-600 mb-4 text-lg">Arriving Soon</h3>
                                    <div className="space-y-6">
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start pb-6 border-b border-violet-50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                                <div className="bg-violet-50 dark:bg-slate-700 p-2 rounded-xl shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mix-blend-multiply dark:mix-blend-normal" />
                                                </div>
                                                <div className="flex-1">
                                                    <Link to={`/product/${item.product}`} className="font-bold text-violet-950 dark:text-white text-lg hover:text-emerald-500 transition-colors line-clamp-2 mb-1">{item.name}</Link>
                                                    <p className="text-violet-500 dark:text-slate-400 text-sm mb-2">Qty: {item.qty}</p>
                                                    <p className="font-extrabold text-violet-900 dark:text-emerald-400">₹{item.price}</p>
                                                </div>
                                                <div className="flex flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                                    <button className="bg-emerald-50 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-slate-600 text-emerald-700 dark:text-emerald-400 font-bold py-2 px-4 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-colors text-sm w-full text-center">
                                                        Track Package
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default Orders
