import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import Skeleton from "../components/Skeleton"
import { fetchProducts } from "../api/productsApi"
import { type Product } from "../data/products"
import { Filter, SlidersHorizontal, PackageX, Star, ArrowRight, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function Home() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")?.toLowerCase() || ""

  const [productsData, setProductsData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedBrand, setSelectedBrand] = useState<string>("All")
  const [priceRange, setPriceRange] = useState<number>(3000)
  const [sortBy, setSortBy] = useState<string>("Popularity")

  const categories = ["All", "shirts", "tshirts", "jeans", "jackets"]
  const brands = ["All", "Van Heusen", "Levi's", "Wrangler", "Puma", "Allen Solly"]

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(false)
      try {
        const data = await fetchProducts()
        setProductsData(data)
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filter and Sort Logic
  let filteredProducts = productsData.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery)) return false;
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
    if (selectedBrand !== "All" && product.brand !== selectedBrand) return false;
    if (product.price > priceRange) return false;
    return true;
  })

  filteredProducts = filteredProducts.sort((a, b) => {
    if (sortBy === "Price Low to High") return a.price - b.price
    if (sortBy === "Price High to Low") return b.price - a.price
    if (sortBy === "Popularity") return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-violet-50 dark:bg-slate-900 font-sans flex flex-col transition-colors"
    >
      <Navbar />

      {/* Discount Banner */}
      <div className="bg-emerald-500 text-white py-3 px-4 text-center text-sm font-bold tracking-wider relative z-10 shadow-sm">
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          SUMMER SALE! GET 20% OFF ALL JEANS. USE CODE: <span className="bg-emerald-700 px-2 py-1 rounded">SUMMER26</span>
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8 flex-grow">

        {/* SIDEBAR FILTERS */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-violet-100 dark:border-slate-700 p-6 sticky top-32 transition-colors">
            <div className="flex items-center gap-2 mb-6 text-violet-950 dark:text-white border-b border-violet-100 dark:border-slate-700 pb-4">
              <Filter size={20} />
              <h2 className="font-bold text-lg">Filters</h2>
            </div>

            {/* Category Filter */}
            <div className="mb-6 border-b border-violet-50 dark:border-slate-700 pb-6">
              <h3 className="font-semibold text-violet-900 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Category</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedCategory === cat ? 'border-emerald-500' : 'border-violet-200 dark:border-slate-600 group-hover:border-emerald-300'}`}>
                      {selectedCategory === cat && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                    </div>
                    <span className={`text-sm tracking-wide capitalize ${selectedCategory === cat ? 'text-emerald-600 font-bold' : 'text-violet-600 dark:text-slate-400'}`}>{cat}</span>
                    <input type="radio" name="category" className="hidden" onChange={() => setSelectedCategory(cat)} />
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6 border-b border-violet-50 dark:border-slate-700 pb-6">
              <h3 className="font-semibold text-violet-900 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Brand</h3>
              <div className="space-y-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrand === brand ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-violet-200 dark:border-slate-600 bg-white dark:bg-slate-700 group-hover:border-emerald-300'}`}>
                      {selectedBrand === brand && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <span className={`text-sm tracking-wide ${selectedBrand === brand ? 'text-emerald-600 font-bold' : 'text-violet-600 dark:text-slate-400'}`}>{brand}</span>
                    <input type="radio" name="brand" className="hidden" onChange={() => setSelectedBrand(brand)} />
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-violet-900 dark:text-slate-300 text-sm uppercase tracking-wider">Max Price</h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full text-center min-w-[3rem]">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="500" max="5000" step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-violet-100 dark:bg-slate-700 rounded-lg appearance-none outline-none"
              />
              <div className="flex justify-between text-xs text-violet-400 mt-2 font-medium">
                <span>₹500</span>
                <span>₹5000+</span>
              </div>
            </div>

          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1">

          {/* Top Bar (Search Result Info & Sorting) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-3xl shadow-sm border border-violet-100 dark:border-slate-700 mb-8 gap-4 transition-colors">
            <div>
              {searchQuery ? (
                <h1 className="text-2xl font-bold text-violet-950 dark:text-white">
                  Search results for <span className="text-emerald-500">"{searchQuery}"</span>
                </h1>
              ) : (
                <h1 className="text-2xl font-bold text-violet-950 dark:text-white">Explore Products</h1>
              )}
              <p className="text-violet-500 dark:text-slate-400 text-sm mt-1 font-medium">{filteredProducts.length} items found</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-semibold text-violet-900 dark:text-slate-300 hidden sm:flex items-center gap-1"><SlidersHorizontal size={16} /> Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 text-violet-900 dark:text-slate-200 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:w-auto p-2.5 font-medium outline-none cursor-pointer"
              >
                <option>Popularity</option>
                <option>Price Low to High</option>
                <option>Price High to Low</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-3xl p-8 text-center text-rose-600 mb-8">
              <p className="font-bold mb-4">Something went wrong while fetching products.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-rose-600 text-white px-6 py-2 rounded-full font-bold hover:bg-rose-700 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <Skeleton key={n} />)}
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-violet-100 dark:border-slate-700 shadow-sm p-16 flex flex-col items-center justify-center text-center h-[50vh]"
            >
              <div className="bg-violet-50 dark:bg-slate-700 p-6 rounded-full inline-block mb-4 text-violet-300 dark:text-slate-500">
                <PackageX size={64} />
              </div>
              <h2 className="text-2xl font-bold text-violet-900 dark:text-white mb-2">No products found</h2>
              <p className="text-violet-500 dark:text-slate-400 max-w-sm">We couldn't find any products matching your current filters. Try adjusting your search or removing some filters.</p>
              <button
                onClick={() => { setSelectedCategory("All"); setSelectedBrand("All"); setPriceRange(3000); }}
                className="mt-8 bg-violet-100 dark:bg-slate-700 hover:bg-violet-200 dark:hover:bg-slate-600 text-violet-800 dark:text-white font-bold py-2 px-6 rounded-full transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </main>
      </div>

      {/* Best Sellers & New Arrivals */}
      <section className="bg-white dark:bg-slate-800 py-16 transition-colors border-t border-violet-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

          {/* Best Sellers */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-violet-950 dark:text-white mb-2">Best Sellers 🔥</h2>
                <p className="text-violet-500 dark:text-slate-400">Our most popular items loved by customers.</p>
              </div>
              <span className="hidden sm:flex text-emerald-500 font-bold items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer">
                View All <ArrowRight size={16} />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                [1, 2, 3, 4].map(n => <Skeleton key={`bs-${n}`} />)
              ) : (
                productsData.slice(0, 4).sort((a, b) => (b.rating || 0) - (a.rating || 0)).map(product => (
                  <ProductCard key={`bs-${product.id}`} id={product.id} name={product.name} price={product.price} image={product.image} />
                ))
              )}
            </div>
          </div>

          {/* New Arrivals */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-violet-950 dark:text-white mb-2">New Arrivals ✨</h2>
                <p className="text-violet-500 dark:text-slate-400">Fresh stock just added explicitly for you.</p>
              </div>
              <span className="hidden sm:flex text-emerald-500 font-bold items-center gap-2 hover:text-emerald-400 transition-colors cursor-pointer">
                View All <ArrowRight size={16} />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                [1, 2, 3, 4].map(n => <Skeleton key={`na-${n}`} />)
              ) : (
                productsData.slice(4, 8).map(product => (
                  <ProductCard key={`na-${product.id}`} id={product.id} name={product.name} price={product.price} image={product.image} />
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Featured Brands Banner */}
      <section className="bg-white dark:bg-slate-800 border-y border-violet-100 dark:border-slate-700 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-sm font-bold text-violet-400 dark:text-slate-500 uppercase tracking-widest mb-8">Trusted by Premium Brands</h3>
          <div className="flex flex-wrap justify-center gap-12 sm:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {brands.filter(b => b !== "All").map(brand => (
              <span key={brand} className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">{brand.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
        <h2 className="text-3xl font-black text-violet-950 dark:text-white mb-4">Trending Collections</h2>
        <p className="text-violet-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">Discover the season's hottest drops. Curated explicitly for individuals who refuse to blend in.</p>

        <div className="flex flex-col md:flex-row gap-6 h-96">
          <div className="flex-1 bg-gradient-to-br from-violet-200 to-indigo-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl overflow-hidden relative group cursor-pointer border border-violet-100 dark:border-slate-700 shadow-sm">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
            <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt="T-shirts" />
            <div className="absolute bottom-8 left-8 z-20 text-left">
              <h3 className="text-white text-3xl font-bold mb-2">Summer Tees</h3>
              <span className="text-white font-medium flex items-center gap-2">Shop Now <ArrowRight size={16} /></span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-slate-700 dark:to-slate-800 rounded-3xl overflow-hidden relative group cursor-pointer border border-violet-100 dark:border-slate-700 shadow-sm">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
            <img src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt="Jeans" />
            <div className="absolute bottom-8 left-8 z-20 text-left">
              <h3 className="text-white text-3xl font-bold mb-2">Denim Fits</h3>
              <span className="text-white font-medium flex items-center gap-2">Shop Now <ArrowRight size={16} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-violet-900 dark:bg-slate-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20">
              <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /></div>
              <p className="text-violet-100 mb-6 line-clamp-4">"The quality of the Slim Fit Formal Shirt I bought is outstanding. It fits perfectly and the fabric feels extremely premium. Will definitely shop here again."</p>
              <h4 className="font-bold">- Rahul Sharma</h4>
            </div>
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20">
              <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star size={16} /></div>
              <p className="text-violet-100 mb-6 line-clamp-4">"Super fast delivery and great packaging! The Vintage Denim Jacket looks even better in person. Just wish there were more color options."</p>
              <h4 className="font-bold">- Priya Patel</h4>
            </div>
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm border border-white/20">
              <div className="flex text-yellow-400 mb-4"><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /></div>
              <p className="text-violet-100 mb-6 line-clamp-4">"NovaCart has revolutionized my wardrobe. The user experience on the website is smooth, dark mode is beautiful, and the customer support is top-notch."</p>
              <h4 className="font-bold">- Aakash Singh</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-emerald-50 dark:bg-slate-800 rounded-3xl p-8 sm:p-16 border border-emerald-100 dark:border-slate-700 shadow-sm transition-colors">
          <Mail size={48} className="mx-auto text-emerald-500 mb-6" />
          <h2 className="text-3xl font-black text-violet-950 dark:text-white mb-4">Subscribe to our Newsletter</h2>
          <p className="text-violet-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">Get the latest updates on new arrivals, exclusive discounts, and special offers delivered directly to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}>
            <input type="email" required placeholder="Enter your email address" className="flex-1 px-6 py-4 rounded-full border border-violet-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-emerald-500/30 transition-colors">
              Subscribe
            </motion.button>
          </form>
        </div>
      </section>

    </motion.div>
  )
}

export default Home