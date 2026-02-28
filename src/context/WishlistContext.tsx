/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"

export interface WishlistItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    addToWishlist: (product: WishlistItem) => void;
    removeFromWishlist: (id: string | number) => void;
    isInWishlist: (id: string | number) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | null>(null)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
        try {
            const localData = localStorage.getItem("wishlist")
            return localData ? JSON.parse(localData) : []
        } catch {
            return []
        }
    })

    useEffect(() => {
        localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }, [wishlist])

    const addToWishlist = (product: WishlistItem) => {
        setWishlist(prev => {
            if (!prev.find(item => item.id === product.id)) {
                return [...prev, product]
            }
            return prev;
        })
    }

    const removeFromWishlist = (id: string | number) => {
        setWishlist(prev => prev.filter(item => item.id !== id))
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
