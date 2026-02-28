import Navbar from "../components/Navbar"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

function Wishlist() {
    const { wishlist, removeFromWishlist } = useWishlist()
    const { addToCart } = useCart()

    return (
        <div className="min-h-screen bg-violet-50 flex flex-col font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full flex-grow">
                <h1 className="text-3xl font-extrabold text-violet-950 mb-8 border-b-2 border-violet-100 pb-4">
                    My Wishlist {wishlist.length > 0 && <span className="text-violet-400 text-lg font-medium ml-2">({wishlist.length} items)</span>}
                </h1>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-violet-100 p-16 text-center flex flex-col items-center justify-center h-[50vh]">
                        <div className="bg-rose-50 p-6 rounded-full inline-block mb-6 text-rose-400">
                            <Heart size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-violet-900 mb-4">Your wishlist is empty</h2>
                        <p className="text-violet-500 mb-8 max-w-md mx-auto">Save items you love to your wishlist. Review them anytime and easily move them to your cart.</p>
                        <Link to="/" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg shadow-emerald-500/30">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <div key={item.id} className="group bg-white rounded-3xl shadow-sm border border-violet-100 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden relative p-4">

                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur hover:bg-rose-50 p-2 text-rose-500 rounded-full shadow-sm hover:shadow transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="relative h-56 w-full bg-violet-50 rounded-2xl flex items-center justify-center p-4 mb-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                                    />
                                </div>

                                <div className="flex flex-col flex-1">
                                    <h3 className="font-bold text-violet-950 text-lg line-clamp-2 mb-2">{item.name}</h3>
                                    <div className="text-xl font-extrabold text-violet-900 mb-4">₹{item.price}</div>

                                    <div className="mt-auto pt-4 border-t border-violet-50 flex gap-2">
                                        <button
                                            onClick={() => {
                                                addToCart(item);
                                                removeFromWishlist(item.id);
                                            }}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                                        >
                                            <ShoppingCart size={18} /> Move to Cart
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist
