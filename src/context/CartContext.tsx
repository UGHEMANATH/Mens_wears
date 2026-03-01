import { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import axios from "axios"
import { useAuth } from "./AuthContext"

export interface CartItem {
  id: string | number;
  product?: string; // MongoDB Reference ID
  name: string;
  price: number;
  image: string;
  quantity: number;
  qty?: number; // Backend consistency
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, amount: number) => Promise<void>;
  clearCart: () => void;
  loading: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Fetch cart on user login
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCart([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        // Map backend 'qty' and 'product' back to frontend 'quantity' and 'id'
        if (data && data.cartItems) {
          const mappedCart = data.cartItems.map((item: any) => ({
            id: item.product,
            product: item.product,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.qty || 1
          }));
          setCart(mappedCart);
        }
      } catch (error) {
        console.error("Cart fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (productObj: Omit<CartItem, 'quantity'>) => {
    // Optimistic UI update
    setCart(prev => {
      const existing = prev.find(item => item.id === productObj.id)
      if (existing) {
        return prev.map(item => item.id === productObj.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...productObj, quantity: 1 }]
    })

    if (!user) return; // Only process API if logged in

    try {
      await axios.post(`${API_URL}/api/cart/add`, {
        product: productObj.id,
        name: productObj.name,
        image: productObj.image,
        price: productObj.price,
        qty: 1
      }, { headers: { Authorization: `Bearer ${user.token}` } });
    } catch (error) {
      console.error("Failed to add to backend cart:", error);
    }
  }

  const removeFromCart = async (id: string | number) => {
    // Optimistic UI Update
    setCart(cart.filter(item => item.id !== id))

    if (!user) return;

    try {
      await axios.delete(`${API_URL}/api/cart/remove`, {
        headers: { Authorization: `Bearer ${user.token}` },
        data: { product: id.toString() }
      });
    } catch (error) {
      console.error("Failed to remove from backend cart:", error);
    }
  }

  const updateQuantity = async (id: string | number, amount: number) => {
    // Technically update is an Add/Remove sync in this simplified schema, but we'll do local optimistic primarily.
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        return { ...item, quantity: Math.max(1, newQty) }
      }
      return item;
    }))
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}