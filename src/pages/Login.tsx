import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Lock, Mail, User, AlertCircle } from "lucide-react"

function Login() {
    const { login, register, loading, error: authError } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(true)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localError, setLocalError] = useState<string | null>(null)

    // Redirect to the page requested or fallback to profile
    const from = location.state?.from?.pathname || "/profile"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError(null)

        if (!email || !password || (!isLogin && !name)) {
            setLocalError("Please fill out all visible fields.")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLocalError("Please enter a valid email address.")
            return
        }

        if (!isLogin) {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
            if (!passwordRegex.test(password)) {
                setLocalError("Password must be > 8 characters with at least one uppercase, lowercase, number, and special character.")
                return
            }
        }

        let success = false
        if (isLogin) {
            success = await login(email, password)
        } else {
            success = await register(name.toUpperCase(), email, password)
        }

        if (success) {
            navigate(from, { replace: true })
        }
    }

    return (
        <div className="min-h-screen bg-violet-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center flex-col items-center">
                    <h2 className="text-3xl font-black tracking-tight text-violet-950 dark:text-white transition-colors">
                        Nova<span className="text-emerald-500">Cart</span>
                    </h2>
                    <p className="mt-2 text-sm text-violet-600 dark:text-slate-400 font-medium">
                        {isLogin ? "Sign in to access your orders and profile." : "Create an account to start shopping."}
                    </p>
                </Link>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-violet-100 dark:border-slate-700 transition-colors">

                    {(authError || localError) && (
                        <div className="mb-4 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
                            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                            <p className="text-red-700 dark:text-red-400 text-sm font-medium">{localError || authError}</p>
                        </div>
                    )}

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
                                        required={!isLogin}
                                        value={name}
                                        onChange={(e) => setName(e.target.value.toUpperCase())}
                                        className="w-full bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 text-violet-900 dark:text-white rounded-xl pl-10 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium uppercase placeholder:normal-case"
                                        placeholder="Full Name"
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
                                    placeholder="your@email.com"
                                    className="w-full bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 text-violet-900 dark:text-white rounded-xl pl-10 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium placeholder:text-violet-300 dark:placeholder:text-slate-500"
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
                                    placeholder="••••••••"
                                    className="w-full bg-violet-50 dark:bg-slate-700 border border-violet-200 dark:border-slate-600 text-violet-900 dark:text-white rounded-xl pl-10 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium placeholder:text-violet-300 dark:placeholder:text-slate-500"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : (isLogin ? "Sign in" : "Create Account")}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setLocalError(null);
                                    setEmail("");
                                    setPassword("");
                                    setName("");
                                }}
                                className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors cursor-pointer"
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
