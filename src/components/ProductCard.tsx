import { useContext } from "react"
import { CartContext } from "../context/CartContext"

function ProductCard({ name, price, image }: any) {

  const { addToCart } = useContext(CartContext)

  return (
    <div className="bg-white shadow rounded-lg p-4">

      <img src={image} className="rounded mb-4"/>

      <h2 className="font-semibold">{name}</h2>

      <p className="mb-3">₹{price}</p>

      <button
        onClick={() => addToCart({ name, price, image })}
        className="bg-black text-white w-full py-2 rounded"
      >
        Add to Cart
      </button>

    </div>
  )
}

export default ProductCard