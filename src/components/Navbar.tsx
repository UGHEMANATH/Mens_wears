import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { ShoppingCart, Search, Menu, Heart, Sun, Moon, UserCircle, X } from "lucide-react"
import { useState } from "react"

function Navbar() {
  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const { isDarkMode, toggleTheme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      navigate(`/?search=${encodeURIComponent(value)}`)
    } else {
      navigate('/')
    }
  }

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length;

  return (
    <nav className="sticky top-0 z-50 bg-violet-950 dark:bg-slate-950 text-white shadow-lg transition-colors border-b border-white/10">
      {/* Top Navbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 max-w-7xl mx-auto w-full">

        {/* Logo */}
        <div className="flex items-center w-full sm:w-auto justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Nova<span className="text-emerald-400 group-hover:text-white transition-colors">Cart</span>
            </span>
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="sm:hidden cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 w-full max-w-2xl bg-white/10 dark:bg-slate-800 rounded-full overflow-hidden border border-white/20 dark:border-slate-700 focus-within:border-emerald-400 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-emerald-400/50 transition-all">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for clothes, brands, and more..."
            className="flex-1 px-6 py-2.5 bg-transparent text-white focus-within:text-violet-950 dark:focus-within:text-white outline-none w-full placeholder:text-violet-300 dark:placeholder:text-gray-400 focus-within:placeholder:text-gray-400"
          />
          <button className="bg-emerald-500 px-6 py-2.5 text-white hover:bg-emerald-400 transition-colors flex items-center justify-center">
            <Search size={20} />
          </button>
        </div>

        {/* Navigation & Cart/Wishlist */}
        <div className="flex items-center gap-6 text-sm font-medium w-full sm:w-auto justify-end">

          {user ? (
            <Link to="/profile" className="hidden lg:flex flex-col hover:text-emerald-400 transition-colors group">
              <span className="text-xs text-violet-300">Hello,</span>
              <span className="font-bold flex items-center gap-1 group-hover:text-emerald-400">
                <UserCircle size={16} /> {user.name.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link to="/login" className="hidden lg:flex flex-col hover:text-emerald-400 transition-colors">
              <span className="text-xs text-violet-300">Welcome back</span>
              <span className="font-bold">Sign In</span>
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 bg-white/10 hover:bg-white/20 dark:bg-slate-800 rounded-full transition-colors flex items-center justify-center focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
          </button>

          <Link to="/wishlist" className="flex items-center gap-1 hover:text-emerald-400 transition-colors relative">
            <div className="relative p-2 bg-white/10 dark:bg-slate-800 rounded-full">
              <Heart size={24} className={wishlistCount > 0 ? "fill-current text-rose-400" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-violet-950 dark:border-slate-950">
                  {wishlistCount}
                </span>
              )}
            </div>
          </Link>

          <Link to="/cart" className="flex items-center gap-1 hover:text-emerald-400 transition-colors relative">
            <div className="relative p-2 bg-white/10 dark:bg-slate-800 rounded-full">
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-violet-950 dark:border-slate-950">
                {cartItemCount}
              </span>
            </div>
            <span className="font-bold hidden sm:block">Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="hidden sm:flex bg-violet-900 dark:bg-slate-900 px-4 py-3 text-sm gap-8 overflow-x-auto whitespace-nowrap shadow-inner border-t border-white/5 dark:border-slate-800">
        <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2 font-medium"><Menu size={16} /> All Categories</Link>
        <Link to="/shirts" className="hover:text-emerald-400 transition-colors font-medium">Shirts</Link>
        <Link to="/tshirts" className="hover:text-emerald-400 transition-colors font-medium">T-Shirts</Link>
        <Link to="/jeans" className="hover:text-emerald-400 transition-colors font-medium">Jeans</Link>
        <Link to="/jackets" className="hover:text-emerald-400 transition-colors font-medium">Jackets</Link>
        <span className="hover:text-emerald-400 cursor-pointer transition-colors font-medium">New Arrivals</span>
        <span className="hover:text-emerald-400 cursor-pointer transition-colors font-medium">Customer Support</span>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="sm:hidden bg-violet-900 dark:bg-slate-900 border-t border-white/10 shadow-xl flex flex-col p-4 space-y-4">
          <Link onClick={() => setIsMenuOpen(false)} to="/" className="hover:text-emerald-400 transition-colors font-medium block">Home</Link>
          <Link onClick={() => setIsMenuOpen(false)} to="/shirts" className="hover:text-emerald-400 transition-colors font-medium block">Shirts</Link>
          <Link onClick={() => setIsMenuOpen(false)} to="/tshirts" className="hover:text-emerald-400 transition-colors font-medium block">T-Shirts</Link>
          <Link onClick={() => setIsMenuOpen(false)} to="/jeans" className="hover:text-emerald-400 transition-colors font-medium block">Jeans</Link>
          <Link onClick={() => setIsMenuOpen(false)} to="/jackets" className="hover:text-emerald-400 transition-colors font-medium block">Jackets</Link>
          {user ? (
            <Link onClick={() => setIsMenuOpen(false)} to="/profile" className="hover:text-emerald-400 transition-colors font-bold block text-emerald-400">My Profile</Link>
          ) : (
            <Link onClick={() => setIsMenuOpen(false)} to="/login" className="hover:text-emerald-400 transition-colors font-bold block text-emerald-400">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar