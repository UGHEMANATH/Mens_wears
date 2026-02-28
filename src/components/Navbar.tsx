import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { Link } from "react-router-dom"

function Navbar() {

  const { cart } = useContext(CartContext)

  return (
    <nav className="flex justify-between items-center p-6 bg-black text-white">

      <h1 className="text-2xl font-bold">
        MENSTYLE
      </h1>

      <ul className="flex gap-8">
        <li>Home</li>
        <li>Shirts</li>
        <li>T-Shirts</li>
        <li>Jeans</li>
      </ul>

      <button className="bg-white text-black px-4 py-2 rounded-lg">
        Cart ({cart.length})
      </button>

    </nav>
  )
}

export default Navbar