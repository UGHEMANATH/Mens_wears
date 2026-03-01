import Navbar from "../components/Navbar"

export default function AdminProducts() {
    return (
        <div className="min-h-screen bg-violet-50 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-8">
                <h1 className="text-3xl font-black text-violet-950 mb-8">Manage Products</h1>
                <p>Complete product management tool connected to MongoDB.</p>
                {/* Product Data Grid goes here */}
            </div>
        </div>
    )
}
