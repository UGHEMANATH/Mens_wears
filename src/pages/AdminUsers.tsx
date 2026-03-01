import Navbar from "../components/Navbar"

export default function AdminUsers() {
    return (
        <div className="min-h-screen bg-violet-50 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-8">
                <h1 className="text-3xl font-black text-violet-950 mb-8">Manage Users</h1>
                <p>Track user profiles, verify authorizations, and update access from MongoDB.</p>
                {/* Users Data Grid goes here */}
            </div>
        </div>
    )
}
