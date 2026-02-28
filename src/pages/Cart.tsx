import { useContext } from "react"
import { CartContext } from "../context/CartContext"

function Cart() {

  const { cart, removeFromCart } = useContext(CartContext)

  const total = cart.reduce((sum: number, item: any) => sum + item.price, 0)

  return (
    <div className="max-w-6xl mx-auto py-10">

      <h1 className="text-3xl font-bold mb-6">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-6">

          {cart.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between border p-4 rounded-lg"
            >

              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  className="w-20 h-20 object-cover rounded"
                />

                <div>
                  <h2 className="font-semibold">
                    {item.name}
                  </h2>
                  <p>₹{item.price}</p>
                </div>

              </div>

              <button
                onClick={() => removeFromCart(index)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Remove
              </button>

            </div>
          ))}

          <div className="text-xl font-bold text-right">
            Total: ₹{total}
          </div>

        </div>
      )}

    </div>
  )
}

export default Cart