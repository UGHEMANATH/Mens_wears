import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { type Product } from "../data/products"
import { syncProductsToStorage, fetchProducts } from "../api/productsApi"
import { PackageOpen, Users, LogOut, Edit, Trash2, PlusCircle, Search } from "lucide-react"

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"products" | "orders" | "users">("products")
    const [productsList, setProductsList] = useState<Product[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form states for new/edit product
    const [isEditing, setIsEditing] = useState(false)
    const [currentProductId, setCurrentProductId] = useState<string | number | null>(null)

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("tshirts")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const prodData = await fetchProducts()
                setProductsList(prodData)

                // Mock orders from localstorage
                const localOrders = JSON.parse(localStorage.getItem('orders') || '[]')
                setOrders(localOrders)

                // Mock users from localstorage
                const localUsers = JSON.parse(localStorage.getItem('user') ? `[${localStorage.getItem('user')}]` : '[]')
                setUsers(localUsers)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const resetForm = () => {
        setIsEditing(false)
        setCurrentProductId(null)
        setName("")
        setPrice("")
        setCategory("tshirts")
        setImage("")
        setDescription("")
    }

    const handleEdit = (prod: Product) => {
        setIsEditing(true)
        setCurrentProductId(prod.id)
        setName(prod.name)
        setPrice(String(prod.price))
        setCategory(prod.category)
        setImage(prod.image)
        setDescription(prod.description || "")
    }

    const handleDelete = (id: string | number) => {
        if (confirm("Are you sure you want to delete this product?")) {
            const updated = productsList.filter(p => p.id !== id)
            setProductsList(updated)
            syncProductsToStorage(updated)
        }
    }

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault()

        const newProduct: Product = {
            id: isEditing && currentProductId ? String(currentProductId) : Date.now().toString(),
            name,
            price: Number(price),
            category,
            image,
            description,
            brand: "Nova",
            rating: 5,
            sizes: ["S", "M", "L", "XL"]
        }

        let updatedList;
        if (isEditing) {
            updatedList = productsList.map(p => p.id === currentProductId ? newProduct : p)
        } else {
            updatedList = [newProduct, ...productsList]
        }

        setProductsList(updatedList)
        syncProductsToStorage(updatedList)
        resetForm()
    }

    return (
        <div className="min-h-screen bg-violet-50 dark:bg-slate-900 font-sans flex transition-colors">

            {/* Sidebar Admin Nav */}
            <aside className="w-64 bg-violet-950 dark:bg-slate-950 text-white flex flex-col hidden md:flex min-h-screen fixed hover:w-64 transition-all z-20">
                <div className="p-6">
                    <h2 className="text-2xl font-black tracking-tight text-white mb-2">
                        Nova<span className="text-emerald-500">Admin</span>
                    </h2>
                    <p className="text-violet-400 text-xs font-bold uppercase tracking-wider">Dashboard Controller</p>
                </div>

                <nav className="flex-1 px-4 mt-8 space-y-2">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-medium text-left ${activeTab === 'products' ? 'bg-emerald-500 text-white' : 'text-violet-300 hover:bg-white/10'}`}
                    >
                        <PackageOpen size={20} /> Products
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-medium text-left ${activeTab === 'orders' ? 'bg-emerald-500 text-white' : 'text-violet-300 hover:bg-white/10'}`}
                    >
                        <Search size={20} /> Orders & Ledger
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-medium text-left ${activeTab === 'users' ? 'bg-emerald-500 text-white' : 'text-violet-300 hover:bg-white/10'}`}
                    >
                        <Users size={20} /> Active Users
                    </button>
                </nav>

                <div className="p-6">
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-medium text-left text-rose-400 hover:bg-rose-500 hover:text-white group">
                        <LogOut size={20} /> Sign Out Admin
                    </button>
                </div>
            </aside>

            {/* Main Panel Content */}
            <main className="flex-1 md:ml-64 bg-violet-50 dark:bg-slate-900 min-h-screen transition-colors">
                <Navbar />

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-violet-950 dark:text-white capitalize mb-8">{activeTab} Management</h1>

                    {loading ? (
                        <div className="animate-pulse bg-violet-200 dark:bg-slate-800 h-64 rounded-3xl w-full"></div>
                    ) : (
                        <>
                            {activeTab === "products" && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                    {/* Product Form Editor Component */}
                                    <div className="lg:col-span-1">
                                        <form onSubmit={handleSaveProduct} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-violet-100 dark:border-slate-700 shadow-sm sticky top-32">
                                            <h2 className="text-xl font-bold text-violet-950 dark:text-white mb-6 flex items-center gap-2">
                                                <PlusCircle className="text-emerald-500" /> {isEditing ? "Edit Product" : "Add New Product"}
                                            </h2>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-violet-900 dark:text-slate-300 uppercase">Product Name</label>
                                                    <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full mt-1 bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 rounded-xl px-4 py-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none dark:text-white" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-violet-900 dark:text-slate-300 uppercase">Price (₹)</label>
                                                        <input required value={price} onChange={e => setPrice(e.target.value)} type="number" className="w-full mt-1 bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 rounded-xl px-4 py-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none dark:text-white" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-violet-900 dark:text-slate-300 uppercase">Category</label>
                                                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 rounded-xl px-4 py-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none dark:text-white">
                                                            <option value="shirts">Shirts</option>
                                                            <option value="tshirts">T-Shirts</option>
                                                            <option value="jeans">Jeans</option>
                                                            <option value="jackets">Jackets</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-violet-900 dark:text-slate-300 uppercase">Image URL (unsplash)</label>
                                                    <input required value={image} onChange={e => setImage(e.target.value)} type="url" className="w-full mt-1 bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 rounded-xl px-4 py-2 font-medium focus:ring-1 focus:ring-emerald-500 outline-none dark:text-white" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-violet-900 dark:text-slate-300 uppercase">Description</label>
                                                    <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full mt-1 bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 rounded-xl px-4 py-2 font-medium h-24 focus:ring-1 focus:ring-emerald-500 outline-none dark:text-white custom-scrollbar"></textarea>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex gap-4">
                                                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors">
                                                    {isEditing ? "Update" : "Save Product"}
                                                </button>
                                                {isEditing && (
                                                    <button type="button" onClick={resetForm} className="bg-violet-100 hover:bg-violet-200 text-violet-800 font-bold py-3 px-4 rounded-xl transition-colors">
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>

                                    {/* Products List Database */}
                                    <div className="lg:col-span-2">
                                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-violet-100 dark:border-slate-700 shadow-sm overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-violet-50 dark:bg-slate-700/50">
                                                            <th className="p-4 text-violet-950 dark:text-white font-bold text-sm">Product</th>
                                                            <th className="p-4 text-violet-950 dark:text-white font-bold text-sm">Category</th>
                                                            <th className="p-4 text-violet-950 dark:text-white font-bold text-sm">Price</th>
                                                            <th className="p-4 text-violet-950 dark:text-white font-bold text-sm text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {productsList.map(prod => (
                                                            <tr key={prod.id} className="border-b border-violet-50 dark:border-slate-700/50 last:border-0 hover:bg-violet-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                                                <td className="p-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <img src={prod.image} className="w-12 h-12 rounded object-contain bg-white dark:bg-slate-700 mix-blend-multiply dark:mix-blend-normal p-1" alt={prod.name} />
                                                                        <div>
                                                                            <p className="font-bold text-violet-950 dark:text-white text-sm line-clamp-1">{prod.name}</p>
                                                                            <p className="text-violet-400 dark:text-slate-500 text-xs">ID: {prod.id}</p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-sm text-violet-600 dark:text-slate-400 capitalize font-medium">{prod.category}</td>
                                                                <td className="p-4 font-bold text-violet-950 dark:text-white">₹{prod.price}</td>
                                                                <td className="p-4 text-right">
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <button onClick={() => handleEdit(prod)} className="p-2 text-violet-500 hover:bg-violet-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                                                            <Edit size={16} />
                                                                        </button>
                                                                        <button onClick={() => handleDelete(prod.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors">
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "orders" && (
                                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-violet-100 dark:border-slate-700 p-8 text-center text-violet-500 dark:text-slate-400 mt-12 max-w-2xl mx-auto">
                                    <h2 className="text-2xl font-bold text-violet-950 dark:text-white mb-2">Order Ledger Data</h2>
                                    <p className="mb-6">Raw global JSON readout of simulated backend processing module.</p>
                                    <pre className="text-left bg-slate-900 text-emerald-400 p-4 rounded-xl overflow-x-auto text-xs w-full max-h-96 custom-scrollbar">
                                        {JSON.stringify(orders, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {activeTab === "users" && (
                                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-violet-100 dark:border-slate-700 p-8 text-center text-violet-500 dark:text-slate-400 mt-12 max-w-2xl mx-auto">
                                    <h2 className="text-2xl font-bold text-violet-950 dark:text-white mb-2">Active Authorized Users</h2>
                                    <p className="mb-6">Global payload cache showing current mocked authentication layers.</p>
                                    <pre className="text-left bg-slate-900 text-teal-400 p-4 rounded-xl overflow-x-auto text-xs w-full max-h-96 custom-scrollbar">
                                        {JSON.stringify(users, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
