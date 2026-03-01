import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Cart from "./pages/Cart"
import Shirts from "./pages/Shirts"
import Tshirts from "./pages/Tshirts"
import Jeans from "./pages/Jeans"
import Jackets from "./pages/Jackets"
import ProductDetails from "./pages/ProductDetails"
import Wishlist from "./pages/Wishlist"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Orders from "./pages/Orders"
import Payment from "./pages/Payment"
import AdminDashboard from "./pages/AdminDashboard"
import AdminProducts from "./pages/AdminProducts"
import AdminOrders from "./pages/AdminOrders"
import AdminUsers from "./pages/AdminUsers"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"

import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <div className="flex flex-col min-h-screen bg-violet-50 dark:bg-slate-900 transition-colors duration-300">
                <div className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/shirts" element={<Shirts />} />
                    <Route path="/tshirts" element={<Tshirts />} />
                    <Route path="/jeans" element={<Jeans />} />
                    <Route path="/jackets" element={<Jackets />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/wishlist" element={<Wishlist />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/payment" element={<Payment />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/orders" element={<Orders />} />
                    </Route>

                    {/* Admin Route */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App