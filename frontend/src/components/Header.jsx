import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBoxOpen,
  FaClipboardList,
  FaUsers
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import SearchBox from "./SearchBox";

const Header = () => {
  const navigate = useNavigate();
  const { cartItems, resetCartContext } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    if (resetCartContext) resetCartContext();
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="bg-secondary text-white shadow-lg relative z-50 font-cairo">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-primary hover:text-green-400 transition"
        >
          متجر سعد
        </Link>

        <div className="hidden md:block flex-1 max-w-xl mx-auto px-8">
          <SearchBox />
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/cart"
            className="flex items-center gap-2 hover:text-primary transition relative"
          >
            <FaShoppingCart className="text-xl" />
            <span>السلة</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce">
                {cartItems.length}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="flex items-center gap-4">
              <span className="font-bold text-primary">
                مرحباً، {userInfo.name}
              </span>
              <Link
                to="/profile"
                className="text-sm font-bold text-gray-300 hover:text-white transition"
              >
                الملف الشخصي
              </Link>
              {!userInfo.isAdmin && (
                <Link
                  to="/myorders"
                  className="text-sm font-bold text-gray-300 hover:text-white transition"
                >
                  طلباتي
                </Link>
              )}
              {userInfo.isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
                  >
                    المنتجات
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="bg-primary px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                  >
                    الطلبات
                  </Link>
                  <Link
                    to="/admin/users"
                    className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                  >
                    المستخدمين
                  </Link>
                </>
              )}
              <button
                onClick={logoutHandler}
                className="text-red-400 hover:text-red-300 transition"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 hover:text-primary transition"
            >
              <FaUser className="text-xl" />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/cart"
            className="relative text-white hover:text-primary transition"
          >
            <FaShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white focus:outline-none hover:text-primary transition"
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 transition-opacity backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-[#1a1a2e] text-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-700 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <span className="text-xl font-bold text-primary">متجر سعد</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-red-500 transition bg-gray-800 p-2 rounded-full"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="mb-8 w-full">
            <SearchBox />
          </div>

          <div className="flex flex-col gap-3 flex-grow overflow-y-auto custom-scrollbar">
            {userInfo ? (
              <>
                <div className="bg-gray-800/50 p-4 rounded-xl mb-4 border border-gray-700 text-center">
                  <p className="text-xs text-gray-400 mb-2">مسجل دخول باسم</p>
                  <p className="font-bold text-white text-xl">
                    {userInfo.name}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition text-gray-200 font-bold"
                >
                  <div className="bg-gray-700 p-2 rounded-lg text-primary">
                    <FaUser />
                  </div>
                  الملف الشخصي
                </Link>

                {!userInfo.isAdmin && (
                  <Link
                    to="/myorders"
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex items-center gap-4 p-3 hover:bg-gray-800 rounded-xl transition text-gray-200 font-bold"
                  >
                    <div className="bg-gray-700 p-2 rounded-lg text-primary">
                      <FaClipboardList />
                    </div>
                    طلباتي
                  </Link>
                )}

                {userInfo.isAdmin && (
                  <div className="mt-4 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50">
                    <p className="text-xs text-gray-400 mb-3 font-bold uppercase tracking-wider">
                      لوحة التحكم
                    </p>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition text-gray-200 mb-2"
                    >
                      <FaBoxOpen className="text-green-400" /> المنتجات
                    </Link>
                    <Link
                      to="/admin/orders"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition text-gray-200 mb-2"
                    >
                      <FaClipboardList className="text-green-400" /> الطلبات
                    </Link>
                    <Link
                      to="/admin/users"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition text-gray-200"
                    >
                      <FaUsers className="text-blue-400" /> المستخدمين
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-center gap-3 p-4 hover:bg-green-700 rounded-xl transition text-white font-bold bg-primary shadow-lg shadow-green-900/20"
              >
                <FaUser /> تسجيل الدخول
              </Link>
            )}
          </div>

          {userInfo && (
            <div className="mt-auto pt-6 border-t border-gray-700">
              <button
                onClick={logoutHandler}
                className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-3.5 rounded-xl flex justify-center items-center gap-2 hover:bg-red-500 hover:text-white transition font-bold"
              >
                <FaSignOutAlt /> تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
