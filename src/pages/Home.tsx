import Navbar from "../components/Navbar"
import ProductCard from "../components/ProductCard"
import { products } from "../data/products"

function Home() {
  return (
    <div>

      <Navbar />

      {/* HERO SECTION */}
      <div className="grid grid-cols-2 items-center bg-gray-100 p-16">

        <div>
          <h1 className="text-5xl font-bold mb-6">
            Men's Fashion Collection
          </h1>

          <p className="text-gray-600 mb-6">
            Discover premium fashion styles designed for modern men.
          </p>

          <button className="bg-black text-white px-6 py-3 rounded-lg">
            Shop Now
          </button>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1516826957135-700dedea698c"
            className="rounded-xl"
          />
        </div>

      </div>

      {/* PRODUCT SECTION */}
      <div className="p-16">

        <h2 className="text-3xl font-bold mb-10">
          Featured Products
        </h2>

        <div className="grid grid-cols-4 gap-8">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}

        </div>

      </div>

    </div>
  )
}

export default Home