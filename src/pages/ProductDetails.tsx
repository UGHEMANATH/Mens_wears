import { useParams, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { fetchProductById, fetchProducts } from "../api/productsApi"
import type { Product } from "../data/products"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { useState, useEffect } from "react"
import { ShoppingCart, Star, StarHalf, Truck, ShieldCheck, CreditCard, Send, ArrowRight } from "lucide-react"
import ProductCard from "../components/ProductCard"
import Skeleton from "../components/Skeleton"

export interface Review {
    id: string;
    userName: string;
    rating: number;
    text: string;
    date: string;
}

function ProductDetails() {
    const { id } = useParams()
    const { cart, addToCart, removeFromCart } = useCart()
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
    const [product, setProduct] = useState<Product | null>(null)
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [reviews, setReviews] = useState<Review[]>([])

    // Rating Form Local State
    const [myRating, setMyRating] = useState(5)
    const [myReviewText, setMyReviewText] = useState("")

    // Related Products State
    const [relatedProducts, setRelatedProducts] = useState<any[]>([])
    const [commonProducts, setCommonProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Scroll to top automatically when ID changes
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    useEffect(() => {
        setIsLoading(true)
        if (id) {
            const loadData = async () => {
                try {
                    // Fetch Specific Product
                    const fetchedProduct = await fetchProductById(id)
                    if (fetchedProduct) {
                        setProduct(fetchedProduct)

                        // Load Mock Local Reviews
                        const allReviews = JSON.parse(localStorage.getItem('product_reviews') || '{}')
                        setReviews(allReviews[id] || [])

                        // Fetch Related/Common items concurrently
                        const data = await fetchProducts()
                        const catProducts = data.filter((p: any) => p.category === fetchedProduct.category && String(p.id) !== String(id))
                        setRelatedProducts(catProducts.slice(0, 4))
                        setCommonProducts(data.slice(8, 12)) // Recommendations
                    }
                } catch (err) {
                    console.error("Failed to load product details", err)
                } finally {
                    setIsLoading(false)
                }
            }
            loadData()
        }
    }, [id])

    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault()
        if (!id) return;

        const newReview: Review = {
            id: Date.now().toString(),
            userName: "Current User", // Mocked since we don't force auth on product view here yet
            rating: myRating,
            text: myReviewText,
            date: new Date().toLocaleDateString()
        }

        const updatedReviews = [newReview, ...reviews]
        setReviews(updatedReviews)

        const allReviewsData = JSON.parse(localStorage.getItem('product_reviews') || '{}')
        allReviewsData[id] = updatedReviews
        localStorage.setItem('product_reviews', JSON.stringify(allReviewsData))

        setMyReviewText("")
        setMyRating(5)
    }

    if (!product && !isLoading) {
        return (
            <div className="min-h-screen bg-violet-50 dark:bg-slate-900 flex flex-col font-sans transition-colors">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-violet-500 dark:text-slate-400">Product not found.</h1>
                </div>
            </div>
        )
    }

    const currentAverageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : (product?.rating || 4.5);

    const reviewCount = reviews.length > 0 ? reviews.length : 128;

    const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
        const fullStars = Math.floor(rating)
        const hasHalf = !interactive && rating % 1 !== 0

        return (
            <div className={`flex text-yellow-400 items-center ${interactive ? 'cursor-pointer' : ''}`}>
                {[1, 2, 3, 4, 5].map((star) => {
                    if (star <= fullStars) {
                        return <Star key={star} size={interactive ? 24 : 18} fill="currentColor" onClick={() => interactive && onRate && onRate(star)} className={interactive ? "hover:scale-110 transition-transform" : ""} />
                    } else if (hasHalf && star === fullStars + 1) {
                        return <StarHalf key={star} size={interactive ? 24 : 18} fill="currentColor" />
                    } else {
                        return <Star key={star} size={interactive ? 24 : 18} onClick={() => interactive && onRate && onRate(star)} className={`text-slate-300 dark:text-slate-600 ${interactive ? "hover:scale-110 transition-transform" : ""}`} />
                    }
                })}
                {!interactive && <span className="text-violet-500 dark:text-slate-400 ml-2 text-sm font-medium">{rating.toFixed(1)} out of 5 ({reviewCount} reviews)</span>}
            </div>
        )
    }

    const inCart = product && cart.some(item => String(item.id) === String(product.id));
    const inWishlist = product && isInWishlist(product.id);

    return (
        <div className="min-h-screen bg-violet-50 dark:bg-slate-900 font-sans transition-colors flex flex-col">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
                {isLoading ? (
                    <div className="flex flex-col md:flex-row gap-8 mb-12 animate-pulse">
                        <div className="md:w-1/2 p-8 bg-slate-200 dark:bg-slate-700 h-[500px] rounded-3xl"></div>
                        <div className="md:w-1/2 flex flex-col gap-6">
                            <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                            <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                            <div className="h-12 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                            <div className="h-32 w-full bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                            <div className="h-16 w-full bg-slate-200 dark:bg-slate-700 rounded-md mt-auto"></div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-violet-100 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row transition-colors">

                        {/* Product Image */}
                        <div className="md:w-1/2 p-8 flex items-center justify-center bg-violet-50/50 dark:bg-slate-700/50 border-r border-violet-100 dark:border-slate-700">
                            {product && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="max-h-[500px] object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-xl"
                                />
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col">
                            <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm mb-2">{product?.category}</span>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-violet-950 dark:text-white mb-4 leading-tight">{product?.name}</h1>

                            <div className="mb-6 bg-violet-50 dark:bg-slate-700/50 inline-flex p-2 rounded-xl pr-4">
                                {renderStars(currentAverageRating)}
                            </div>

                            <div className="mb-6 flex items-baseline">
                                <span className="text-4xl font-extrabold text-violet-950 dark:text-white">₹{product?.price}</span>
                                <span className="text-lg text-violet-300 dark:text-slate-500 line-through ml-3">₹{Math.round((product?.price || 0) * 1.2)}</span>
                                <p className="text-sm text-emerald-500 font-bold ml-4 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">20% OFF</p>
                            </div>

                            <p className="text-violet-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                                {product?.description || "Premium quality material engineered for modern individuals. Extremely comfortable, highly durable, and styled exactly out of the trends happening across the globe right now."}
                            </p>

                            {/* Size Selector */}
                            {product?.sizes && (
                                <div className="mb-8">
                                    <div className="flex justify-between mb-3 items-end">
                                        <span className="font-bold text-violet-900 dark:text-slate-200">Select Size</span>
                                        <span className="text-emerald-500 text-sm cursor-pointer hover:underline font-bold">Size Chart</span>
                                    </div>
                                    <div className="flex gap-3 flex-wrap">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`w-14 h-14 rounded-2xl font-bold flex items-center justify-center border-2 transition-all duration-300 ${selectedSize === size
                                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500 text-emerald-600 dark:text-white shadow-md transform scale-105'
                                                    : 'border-violet-200 dark:border-slate-600 text-violet-600 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-violet-100 dark:border-slate-700">
                                <button
                                    onClick={() => {
                                        if (product) {
                                            if (inCart) {
                                                removeFromCart(product.id)
                                            } else {
                                                addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })
                                            }
                                        }
                                    }}
                                    className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-95 shadow-sm border border-transparent
                                        ${inCart ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-violet-100 dark:bg-slate-700 hover:bg-violet-200 dark:hover:bg-slate-600 text-violet-900 dark:text-white"}`}
                                >
                                    <ShoppingCart size={20} /> {inCart ? "Remove from Cart" : "Add to Cart"}
                                </button>
                                <button
                                    onClick={() => {
                                        if (product) {
                                            if (inWishlist) {
                                                removeFromWishlist(product.id)
                                            } else {
                                                addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image })
                                            }
                                        }
                                    }}
                                    className={`flex-1 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
                                        ${inWishlist ? "bg-white border-2 border-rose-500 text-rose-500 hover:bg-rose-50 shadow-rose-500/10" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"}`}
                                >
                                    {inWishlist ? "Remove from Wishlist" : "Buy it Now"}
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-violet-100 dark:border-slate-700 text-center">
                                <div className="flex flex-col items-center gap-2 text-violet-500 dark:text-slate-400">
                                    <Truck size={24} className="text-emerald-400" />
                                    <span className="text-xs font-bold">Free Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-violet-500 dark:text-slate-400">
                                    <ShieldCheck size={24} className="text-violet-400 dark:text-indigo-400" />
                                    <span className="text-xs font-bold">1 Year Warranty</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 text-violet-500 dark:text-slate-400">
                                    <CreditCard size={24} className="text-amber-400" />
                                    <span className="text-xs font-bold">Secure Pay</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Rating & Review Section */}
                <div className="mt-12 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-violet-100 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-violet-950 dark:text-white mb-8">Customer Reviews</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Review Submission */}
                        <div className="md:col-span-1">
                            <div className="bg-violet-50 dark:bg-slate-700/30 rounded-2xl p-6 border border-violet-100 dark:border-slate-700">
                                <h3 className="font-bold text-violet-900 dark:text-white mb-4 text-lg">Write a Review</h3>
                                <form onSubmit={handleAddReview} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-violet-600 dark:text-slate-400 mb-2 block">Your Rating</label>
                                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl inline-block border border-violet-100 dark:border-slate-600">
                                            {renderStars(myRating, true, setMyRating)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-violet-600 dark:text-slate-400 mb-2 block">Your Feedback</label>
                                        <textarea
                                            required
                                            value={myReviewText}
                                            onChange={(e) => setMyReviewText(e.target.value)}
                                            placeholder="What did you like or dislike?"
                                            className="w-full bg-white dark:bg-slate-800 border border-violet-200 dark:border-slate-600 rounded-xl p-4 min-h-[120px] outline-none focus:ring-2 focus:ring-emerald-500 text-violet-900 dark:text-white font-medium text-sm custom-scrollbar"
                                        />
                                    </div>
                                    <button type="submit" className="w-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold py-3 rounded-xl hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                                        Submit Review <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Review List */}
                        <div className="md:col-span-2 space-y-6">
                            {reviews.length === 0 ? (
                                <p className="text-violet-500 dark:text-slate-400 font-medium italic p-4 bg-violet-50 dark:bg-slate-700/50 rounded-xl">Be the first to review this product!</p>
                            ) : (
                                reviews.map((rev) => (
                                    <div key={rev.id} className="bg-violet-50/50 dark:bg-slate-700/20 p-6 rounded-2xl border border-violet-100 dark:border-slate-700/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold">
                                                    {rev.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-violet-900 dark:text-white text-sm">{rev.userName}</p>
                                                    <div className="mt-1">{renderStars(rev.rating)}</div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-violet-400 dark:text-slate-500 font-medium">{rev.date}</span>
                                        </div>
                                        <p className="text-violet-700 dark:text-slate-300 mt-4 leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm text-sm border border-violet-100/50 dark:border-slate-700">
                                            {rev.text}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Recommendations Section */}
                <div className="mt-16 border-t border-violet-100 dark:border-slate-800 pt-16">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-violet-950 dark:text-white mb-2">Customers Also Bought</h2>
                            <p className="text-violet-500 dark:text-slate-400">Based on your interest in {product?.category}</p>
                        </div>
                        <Link to={`/${product?.category}`} className="hidden sm:flex text-emerald-500 font-bold flex items-center gap-2 hover:text-emerald-400 transition-colors">
                            Explore All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            [1, 2, 3, 4].map(n => <Skeleton key={n} />)
                        ) : (
                            relatedProducts.length > 0 ? (
                                relatedProducts.map(rel => (
                                    <ProductCard
                                        key={rel.id}
                                        id={rel.id}
                                        name={rel.name}
                                        price={rel.price}
                                        image={rel.image}
                                    />
                                ))
                            ) : (
                                <p className="text-violet-500 dark:text-slate-400 p-8 col-span-full text-center">No similar products found in this category right now.</p>
                            )
                        )}
                    </div>
                </div>

                <div className="mt-24 border-t border-violet-100 dark:border-slate-800 pt-16 mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-violet-950 dark:text-white mb-2">Recommended For You</h2>
                        <p className="text-violet-500 dark:text-slate-400 max-w-2xl mx-auto">Personalized top suggestions curated from our entire clothing catalogue.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            [1, 2, 3, 4].map(n => <Skeleton key={n} />)
                        ) : (
                            commonProducts.map(rec => (
                                <ProductCard
                                    key={rec.id}
                                    id={rec.id}
                                    name={rec.name}
                                    price={rec.price}
                                    image={rec.image}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails
