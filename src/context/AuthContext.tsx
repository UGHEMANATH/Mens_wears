import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const storedUser = localStorage.getItem("user")
            return storedUser ? JSON.parse(storedUser) : null
        } catch {
            return null
        }
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user))
            axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`
        } else {
            localStorage.removeItem("user")
            delete axios.defaults.headers.common["Authorization"]
        }
    }, [user])

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true)
        setError(null)
        try {
            const config = { headers: { "Content-Type": "application/json" } }
            const { data } = await axios.post(`${API_URL}/api/users/login`, { email, password }, config)
            setUser(data)
            return true
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Login failed")
            return false
        } finally {
            setLoading(false)
        }
    }

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        setLoading(true)
        setError(null)
        try {
            const config = { headers: { "Content-Type": "application/json" } }
            const { data } = await axios.post(`${API_URL}/api/users/register`, { name, email, password }, config)
            setUser(data)
            return true
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Registration failed")
            return false
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within an AuthProvider")
    return context
}
