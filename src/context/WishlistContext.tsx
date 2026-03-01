import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface WishlistItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (product: WishlistItem) => Promise<void>;
    removeFromWishlist: (id: string | number) => Promise<void>;
    isInWishlist: (id: string | number) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | null>(null)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const { user } = useAuth()

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) {
                setWishlist([])
                return
            }
            try {
                const { data } = await axios.get(`${API_URL}/api/wishlist`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })

                if (data && data.products) {
                    const mappedWishlist = data.products.map((item: any) => ({
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                    }))
                    setWishlist(mappedWishlist)
                }
            } catch (error) {
                console.error("Wishlist fetch error:", error)
            }
        }

        fetchWishlist()
    }, [user])

    const addToWishlist = async (product: WishlistItem) => {
        setWishlist(prev => {
            if (!prev.find(item => item.id === product.id)) {
                return [...prev, product]
            }
            return prev;
        })

        if (!user) return

        try {
            await axios.post(`${API_URL}/api/wishlist/add`, {
                product: product.id
            }, { headers: { Authorization: `Bearer ${user.token}` } })
        } catch (error) {
            console.error("Failed to add to backend wishlist:", error)
        }
    }

    const removeFromWishlist = async (id: string | number) => {
        setWishlist(prev => prev.filter(item => item.id !== id))

        if (!user) return

        try {
            await axios.delete(`${API_URL}/api/wishlist/remove`, {
                headers: { Authorization: `Bearer ${user.token}` },
                data: { product: id.toString() }
            })
        } catch (error) {
            console.error("Failed to remove from backend wishlist:", error)
        }
    }

    const isInWishlist = (id: string | number) => {
        return wishlist.some(item => item.id === id)
    }

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    )
}

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider")
    }
    return context
}
