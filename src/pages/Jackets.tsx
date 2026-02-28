import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import { products } from "../data/products"
import { motion } from "framer-motion"

function Jackets() {
    const jackets = products.filter(p => p.category === "jackets")

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-violet-50 dark:bg-slate-900 font-sans transition-colors"
        >
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-violet-950 dark:text-white after:content-[''] after:block after:w-16 after:h-1 after:bg-emerald-500 after:mt-2">
                            Men's Jackets
                        </h1>
                        <p className="text-violet-500 dark:text-slate-400 mt-4">Premium outer layers and stylish jackets for every season.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {jackets.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            badge={product.badge}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default Jackets
