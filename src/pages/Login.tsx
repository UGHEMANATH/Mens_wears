import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Lock, Mail, User, AlertCircle, Rocket } from "lucide-react"
import { motion } from "framer-motion"

function Login() {
    const { login, register, loading, error: authError } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isLogin, setIsLogin] = useState(true)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localError, setLocalError] = useState<string | null>(null)

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

    // Floating animation variants
    const floatAnimation: any = {
        animate: {
            y: [0, -15, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    const floatReverse: any = {
        animate: {
            y: [0, 15, 0],
            transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    return (
        <div className="min-h-screen bg-black overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative z-0">
            {/* Space Background & Neon Glow */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0a1a] to-black opacity-90"></div>

            {/* Glowing Orbs */}
            <motion.div variants={floatAnimation} animate="animate" className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] -z-10"></motion.div>
            <motion.div variants={floatReverse} animate="animate" className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-[120px] -z-10"></motion.div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center flex-col items-center"
                >
                    <Link to="/" className="flex flex-col items-center group">
                        <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className="bg-black/50 p-3 rounded-2xl border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)] mb-4"
                        >
                            <Rocket size={32} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        </motion.div>
                        <h2 className="text-4xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Nova<span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">Cart</span>
                        </h2>
                    </Link>
                    <p className="mt-3 text-sm text-violet-300 font-medium tracking-wider uppercase">
                        {isLogin ? "Anti-Gravity Login Sequence" : "Initialize New Entity Protocol"}
                    </p>
                </motion.div>
            </div>

            <motion.div
                variants={floatAnimation}
                animate="animate"
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
            >
                {/* Glassmorphism Dashboard Box */}
                <div className="bg-white/5 backdrop-blur-xl py-8 px-4 shadow-[0_0_40px_rgba(139,92,246,0.15)] sm:rounded-[2rem] sm:px-10 border border-white/10 relative overflow-hidden">

                    {/* Inner Neon Lines */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>

                    {(authError || localError) && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-6 bg-red-900/30 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        >
                            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                            <p className="text-red-300 text-sm font-medium tracking-wide">{localError || authError}</p>
                        </motion.div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                                <label className="block text-xs font-bold tracking-widest text-violet-300 uppercase mb-2">
                                    Entity Designation
                                </label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-violet-400 group-focus-within:text-emerald-400 transition-colors">
                                        <User size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        required={!isLogin}
                                        value={name}
                                        onChange={(e) => setName(e.target.value.toUpperCase())}
                                        className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl pl-12 px-4 py-3 outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all font-medium uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <label className="block text-xs font-bold tracking-widest text-violet-300 uppercase mb-2">
                                Comms Channel (Email)
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-violet-400 group-focus-within:text-emerald-400 transition-colors">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alpha@nebula.com"
                                    className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl pl-12 px-4 py-3 outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all font-medium placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] tracking-wide"
                                />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            <label className="block text-xs font-bold tracking-widest text-violet-300 uppercase mb-2">
                                Encryption Key (Password)
                            </label>
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-violet-400 group-focus-within:text-emerald-400 transition-colors">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••"
                                    className="w-full bg-black/40 border-2 border-white/5 text-white rounded-2xl pl-12 px-4 py-3 outline-none focus:border-emerald-500/50 focus:bg-white/5 transition-all font-medium placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(16,185,129,0.2)] tracking-[0.3em]"
                                />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative w-full flex justify-center py-4 px-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] text-sm font-black tracking-widest uppercase text-black bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 focus:outline-none transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1 overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-white/20 -translate-x-full skew-x-12 group-hover:animate-[shine_1s_ease-in-out]"></div>
                                {loading ? "Authenticating..." : (isLogin ? "Engage Thrusters" : "Initialize Account")}
                            </button>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setLocalError(null);
                                    setEmail("");
                                    setPassword("");
                                    setName("");
                                }}
                                className="text-xs font-bold tracking-wider uppercase text-violet-400 hover:text-emerald-400 transition-colors drop-shadow-[0_0_5px_rgba(139,92,246,0.5)] cursor-pointer"
                            >
                                {isLogin ? "Require Access? Request Protocol Here" : "Existing Entity? Authenticate Here"}
                            </button>
                        </motion.div>
                    </form>
                </div>
            </motion.div>

            {/* Custom Animation Keyframes for specific effects */}
            <style>{`
                @keyframes shine {
                    100% { transform: translateX(100%) skew(-12deg); }
                }
            `}</style>
        </div>
    )
}

export default Login
