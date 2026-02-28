import { createContext, useState } from "react"

export const CartContext = createContext<any>(null)

export const CartProvider = ({ children }: any) => {

  const [cart, setCart] = useState<any[]>([])

  const addToCart = (product: any) => {
    setCart([...cart, product])
  }

  const removeFromCart = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}