import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProductEditPage from "./pages/admin/ProductEditPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderListPage from "./pages/admin/OrderListPage";
import OrderPage from "./pages/OrderPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProfilePage from "./pages/ProfilePage";
import ProductCreatePage from "./pages/admin/ProductCreatePage";
import CategoryCreatePage from "./pages/admin/CategoryCreatePage";
import UserListPage from "./pages/admin/UserListPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-right font-sans" dir="rtl">
        <Header />
        <main className="container mx-auto py-8 px-4 bg-[#f3f4f6]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/product/create"
              element={<ProductCreatePage />}
            />
            <Route
              path="/admin/category/create"
              element={<CategoryCreatePage />}
            />
            <Route path="/admin/orders" element={<OrderListPage />} />
            <Route
              path="/admin/product/:id/edit"
              element={<ProductEditPage />}
            />
            <Route path="/admin/users" element={<UserListPage />} />

            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/search/:keyword" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route path="/myorders" element={<MyOrdersPage />} />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <ToastContainer position="top-left" rtl />
      </div>
    </Router>
  );
}
export default App;
