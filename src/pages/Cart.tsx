import Navbar from "../components/Navbar"
import { useCart } from "../context/CartContext"
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const navigate = useNavigate()

  // Global totals removed here to fix unused lint warnings since the main summary box is gone

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-violet-50 flex flex-col font-sans"
    >
      <Navbar />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full flex-grow">
        <h1 className="text-3xl font-extrabold text-violet-950 mb-8 border-b-2 border-violet-100 pb-4">
          Shopping Cart {cart.length > 0 && <span className="text-violet-400 text-lg font-medium ml-2">({cart.length} items)</span>}
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-16 text-center flex flex-col items-center justify-center h-96">
            <div className="bg-violet-100 p-6 rounded-full inline-block mb-6 text-violet-400">
              <ShoppingBag size={64} />
            </div>
            <h2 className="text-2xl font-bold text-violet-900 mb-4">Your cart is empty</h2>
            <p className="text-violet-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Discover our latest collections and find something you love!</p>
            <Link to="/" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg shadow-emerald-500/30">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">

            {/* Cart Items List */}
            <div className="space-y-4 overflow-hidden">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    key={`${item.id}-${index}`}
                    className="bg-white border border-violet-100 shadow-sm p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow relative group"
                  >
                    <div className="w-full sm:w-auto flex justify-center bg-violet-50 rounded-2xl p-2 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 w-full text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                        <div>
                          <h2 className="text-xl font-bold text-violet-950 mb-1 leading-tight">
                            {item.name}
                          </h2>
                          <p className="text-emerald-500 text-sm font-semibold mb-3">In Stock</p>
                        </div>
                        <div className="text-right w-full sm:w-auto flex flex-col items-end">
                          <p className="text-2xl font-extrabold text-violet-950">₹{item.price * item.quantity}</p>
                          <p className="text-sm text-violet-400">₹{item.price} each</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-start mt-4 gap-6 pt-4 border-t border-violet-50">

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3 bg-violet-50 rounded-full px-2 py-1 border border-violet-100">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-violet-700 hover:bg-violet-200 transition-colors shadow-sm"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-4 text-center text-violet-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white text-violet-700 hover:bg-violet-200 transition-colors shadow-sm"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl flex items-center gap-1 font-semibold text-sm transition-colors"
                          >
                            <Trash2 size={16} /> <span className="hidden sm:inline">Remove</span>
                          </button>
                          <button
                            onClick={() => {
                              const itemSubtotal = item.price * item.quantity;
                              const itemShipping = itemSubtotal > 0 && itemSubtotal < 500 ? 50 : 0;

                              // Graded Tax calculation
                              const taxRate = itemSubtotal < 2500 ? 0.05 : 0.18;
                              const itemTax = Math.round(itemSubtotal * taxRate);

                              navigate('/checkout', {
                                state: {
                                  singleItemCheckout: true,
                                  cartItems: [item],
                                  subtotal: itemSubtotal,
                                  shipping: itemShipping,
                                  tax: itemTax,
                                  total: itemSubtotal + itemShipping + itemTax
                                }
                              });
                            }}
                            className="bg-violet-900 hover:bg-violet-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-colors shadow-md shadow-violet-900/20 whitespace-nowrap"
                          >
                            Place Order <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>



          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Cart