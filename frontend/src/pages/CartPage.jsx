import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  FaTrash,
  FaArrowRight,
  FaOpencart,
  FaShoppingCart,
  FaTruck
} from "react-icons/fa";

const CartPage = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  const shippingPrice = itemsPrice >= 1000 || itemsPrice === 0 ? 0 : 50;

  const totalPrice = itemsPrice + shippingPrice;

  const checkoutHandler = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=shipping");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <Breadcrumbs currentPage="سلة التسوق" />

      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <FaShoppingCart className="text-3xl text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-secondary">
          سلة التسوق
          <span className="text-sm font-normal text-gray-500 mr-2">
            ({cartItems.reduce((acc, item) => acc + item.qty, 0)} منتجات)
          </span>
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
          <div className="flex justify-center mb-6 text-gray-200 text-8xl">
            <FaOpencart />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            سلتك فارغة حالياً!
          </h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            لم تقم بإضافة أي منتجات بعد، ابدأ بالتسوق الآن واكتشف أفضل العروض
            الحصرية.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100"
          >
            <FaArrowRight /> تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-3/4 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center sm:justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition relative group"
              >
                <div className="flex items-center gap-5 w-full sm:w-auto mb-4 sm:mb-0">
                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <img
                      src={item.imageCover}
                      alt={item.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <div>
                    <Link
                      to={`/product/${item._id}`}
                      className="font-bold text-gray-800 text-lg hover:text-primary transition line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-primary font-bold text-lg mt-1">
                      {item.price.toLocaleString()}{" "}
                      <span className="text-xs text-gray-400">ج.م</span>
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`h-2 w-2 rounded-full ${item.countInStock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                      ></span>
                      <p className="text-gray-400 text-xs font-bold">
                        {item.countInStock > 0 ? "متوفر" : "غير متوفر"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs font-bold">
                      الكمية:
                    </span>
                    <select
                      value={item.qty}
                      onChange={(e) => addToCart(item, Number(e.target.value))}
                      className="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none font-bold w-16 text-center"
                    >
                      {[...Array(item.countInStock).keys()]
                        .slice(0, 10)
                        .map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                    </select>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-3 rounded-xl transition-all shadow-sm"
                    title="حذف المنتج"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/4 lg:sticky lg:top-4 h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-secondary mb-6 pb-4 border-b border-gray-50">
                ملخص الطلب
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 text-sm font-bold">
                  <span>المجموع الفرعي</span>
                  <span className="text-gray-800">
                    {itemsPrice.toLocaleString()} ج.م
                  </span>
                </div>

                <div className="flex justify-between text-gray-500 text-sm font-bold items-center">
                  <span className="flex items-center gap-1">
                    <FaTruck /> الشحن
                  </span>
                  {shippingPrice === 0 ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">
                      مجاني
                    </span>
                  ) : (
                    <span className="text-orange-600">{shippingPrice} ج.م</span>
                  )}
                </div>

                {shippingPrice > 0 && (
                  <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700 leading-relaxed border border-blue-100 flex gap-2 items-start">
                    <span className="text-lg">💡</span>
                    <span>
                      اشتري بـ{" "}
                      <strong>
                        {(1000 - itemsPrice).toLocaleString()} ج.م
                      </strong>{" "}
                      كمان عشان تاخد <strong>شحن مجاني</strong>!
                    </span>
                  </div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg text-secondary">
                      الإجمالي
                    </span>
                    <div className="text-right">
                      <p className="font-black text-2xl text-primary leading-none">
                        {totalPrice.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-gray-400 font-bold">
                        شامل الضريبة
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-100 flex justify-center items-center gap-2 group"
              >
                متابعة للدفع
                <FaArrowRight className="group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
