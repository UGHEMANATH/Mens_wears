import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { Lock, Mail, User } from "lucide-react"

function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true)

    const [name, setName] = useState("John Doe")
    const [email, setEmail] = useState("john@example.com")
    const [password, setPassword] = useState("password123")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // For demo purposes, we ignore password and just login
        login(isLogin ? "Mock User" : name, email)
        navigate("/profile")
    }

    return (
        <div className="min-h-screen bg-violet-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center flex-col items-center">
                    <h2 className="text-3xl font-black tracking-tight text-violet-950 dark:text-white transition-colors">
                        Nova<span className="text-emerald-500">Cart</span>
                    </h2>
                    <p className="mt-2 text-sm text-violet-600 dark:text-slate-400 font-medium">
                        Sign in to access your orders, cart, and profile.
                    </p>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-violet-100 dark:border-slate-700 transition-colors">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-violet-900 dark:text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-violet-400 dark:text-slate-500">
                                        <User size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 text-violet-900 dark:text-white rounded-xl pl-10 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-violet-900 dark:text-slate-300 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-violet-400 dark:text-slate-500">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 text-violet-900 dark:text-white rounded-xl pl-10 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-violet-900 dark:text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-violet-400 dark:text-slate-500">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 text-violet-900 dark:text-white rounded-xl pl-10 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            >
                                {isLogin ? "Sign in" : "Create Account"}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                            >
                                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
