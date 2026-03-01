import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import Skeleton from "../components/Skeleton"
import { fetchProducts } from "../api/productsApi"
import { type Product } from "../data/products"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

function CategoryPage({ title, category }: { title: string, category: string }) {
    const [productsData, setProductsData] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts().then(data => {
            setProductsData(data.filter(p => p.category === category))
            setLoading(false)
        })
    }, [category])

    return (
        <div className="min-h-screen bg-violet-50 dark:bg-slate-900 font-sans flex flex-col transition-colors">
            <Navbar />

            {/* Banner */}
            <div className="bg-violet-900 dark:bg-slate-800 text-white py-16 text-center shadow-inner transition-colors border-b border-violet-800 dark:border-slate-700">
                <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">{title}</h1>
                <p className="text-violet-200 dark:text-slate-400 max-w-2xl mx-auto px-4 font-medium">
                    Discover our premium collection of {title.toLowerCase()}. Crafted with passion, styled for the modern you.
                </p>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-grow">
                {/* Controls Bar */}
                <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-3xl mb-12 shadow-sm border border-violet-100 dark:border-slate-700 transition-colors">
                    <p className="text-violet-500 dark:text-slate-400 font-semibold">{loading ? "Loading..." : `Showing ${productsData.length} products`}</p>
                    <div className="flex bg-violet-50 dark:bg-slate-700/50 rounded-xl p-1 shadow-inner">
                        <button className="px-4 py-2 bg-white dark:bg-slate-600 rounded-lg shadow-sm text-violet-950 dark:text-white font-bold text-sm transition-colors">Grid</button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <Skeleton key={n} />)}
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {productsData.map(product => (
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
    )
}

export default CategoryPage
