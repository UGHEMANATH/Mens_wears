import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { Package, LogOut, ChevronRight, UserCircle } from "lucide-react"

function Profile() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-violet-50 dark:bg-slate-900 font-sans flex flex-col transition-colors">
            <Navbar />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
                <h1 className="text-3xl font-extrabold text-violet-950 dark:text-white mb-8 border-b-2 border-violet-100 dark:border-slate-700 pb-4">
                    Your Account
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Profile Overview */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-violet-100 dark:border-slate-700 shadow-sm text-center">
                            <div className="w-24 h-24 mx-auto bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                <UserCircle size={64} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-bold text-violet-950 dark:text-white mb-1">{user?.name}</h2>
                            <p className="text-violet-500 dark:text-slate-400 text-sm mb-6">{user?.email}</p>

                            <button
                                onClick={handleLogout}
                                className="w-full py-3 px-4 border-2 border-rose-100 hover:border-rose-200 dark:border-rose-900/50 dark:hover:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="md:col-span-2 space-y-4">
                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full bg-white dark:bg-slate-800 p-6 rounded-3xl border border-violet-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 text-left group"
                        >
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-full text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <Package size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-violet-950 dark:text-white mb-1">Your Orders</h3>
                                <p className="text-sm text-violet-500 dark:text-slate-400">Track packages, return items, or buy again</p>
                            </div>
                            <ChevronRight className="text-violet-300 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" />
                        </button>

                        {/* Placeholder for future features */}
                        <button className="w-full bg-white dark:bg-slate-800 p-6 rounded-3xl border border-violet-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 text-left group opacity-60 cursor-not-allowed">
                            <div className="bg-violet-50 dark:bg-slate-700 p-4 rounded-full text-violet-500">
                                <UserCircle size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-violet-950 dark:text-white mb-1">Login & Security</h3>
                                <p className="text-sm text-violet-500 dark:text-slate-400">Edit login, name, and mobile number</p>
                            </div>
                            <ChevronRight className="text-violet-300 dark:text-slate-500" />
                        </button>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default Profile
