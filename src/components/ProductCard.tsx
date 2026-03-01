import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { ShoppingCart, Heart } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

export interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  badge?: string;
}

function ProductCard({ id, name, price, image, badge }: ProductCardProps) {
  const { cart, addToCart, removeFromCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""

  const inWishlist = isInWishlist(id)
  const inCart = cart.some(item => item.id === id || item.id === String(id))

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id)
    } else {
      addToWishlist({ id, name, price, image })
    }
  }

  // Highlight logic for search matching
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 text-slate-900 rounded px-1">{part}</span>
      ) : part
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col h-full overflow-hidden border border-gray-100 dark:border-slate-700 relative"
    >

      {/* Discount Badge */}
      {badge && (
        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full z-20 pointer-events-none shadow-sm uppercase tracking-wider">
          {badge}
        </span>
      )}

      {/* Wishlist Heart */}
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-900 p-2 text-rose-500 rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <Heart size={20} className={inWishlist ? "fill-rose-500" : ""} />
      </motion.button>

      <Link to={`/product/${id}`} className="flex flex-col flex-1 cursor-pointer relative z-10">
        <div className="overflow-hidden relative h-56 w-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center p-4">
          <img
            src={image}
            alt={name}
            className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500 origin-center mix-blend-multiply dark:mix-blend-normal"
          />
        </div>

        <div className="p-5 pb-0 flex flex-col flex-1">
          <p className="text-sm tracking-wide text-orange-500 font-medium mb-1 uppercase">Top Rated</p>
          <h2 className="font-bold text-gray-800 dark:text-white text-lg mb-2 line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
            {highlightMatch(name, searchQuery)}
          </h2>

          {/* Rating Stars Dummy */}
          <div className="flex text-yellow-400 text-sm mb-2">
            ★★★★☆ <span className="text-gray-400 dark:text-slate-400 ml-2 text-xs">(128)</span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{price}</span>
            <span className="text-sm line-through text-gray-400 dark:text-slate-500">₹{Math.round(price * 1.2)}</span>
          </div>
        </div>
      </Link>

      <div className="p-5 pt-0 mt-auto z-20 relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inCart) {
              removeFromCart(id);
            } else {
              addToCart({ id, name, price, image });
            }
          }}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors duration-300 shadow-md relative ${inCart
              ? "bg-rose-500 hover:bg-rose-600 text-white"
              : "bg-slate-900 dark:bg-emerald-600 hover:bg-orange-500 dark:hover:bg-emerald-500 text-white"
            }`}
        >
          <ShoppingCart size={18} /> {inCart ? "Remove from Cart" : "Add to Cart"}
        </motion.button>
      </div>

    </motion.div>
  )
}

export default ProductCard