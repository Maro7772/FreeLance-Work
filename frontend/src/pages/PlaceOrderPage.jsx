import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "../apis/axios";
import { toast } from "react-toastify";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaWallet,
  FaBoxOpen,
  FaCheckCircle,
  FaReceipt
} from "react-icons/fa";

const PlaceOrderPage = () => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice >= 1000 || itemsPrice === 0 ? 0 : 50;
  const taxPrice = 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: Number(item.qty),
          image: item.imageCover,
          price: Number(item.price),
          product: item._id
        })),
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice
      };

      const { data } = await axios.post("/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      toast.success("تم تنفيذ الطلب بنجاح! 🎉");
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الطلب");
      console.error("Details:", error.response?.data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <Breadcrumbs
        pages={[
          { name: "سلة التسوق", url: "/cart" },
          { name: "عنوان الشحن", url: "/shipping" },
          { name: "الدفع", url: "/payment" }
        ]}
        currentPage="مراجعة الطلب"
      />

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1 h-full bg-primary"></div>
            <h2 className="text-xl font-bold mb-4 text-secondary flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> عنوان التوصيل
            </h2>
            <div className="text-gray-600 leading-relaxed pr-4">
              <p className="font-bold text-gray-800 mb-1">
                {shippingAddress.city}, {shippingAddress.country}
              </p>
              <p className="text-sm">{shippingAddress.address}</p>
              <div className="flex items-center gap-2 mt-2 text-sm bg-gray-50 w-fit px-3 py-1 rounded-full border border-gray-200">
                <FaPhone className="text-gray-400" />
                <span className="font-mono dir-ltr">
                  {shippingAddress.phone}
                </span>
              </div>
            </div>
            <Link
              to="/shipping"
              className="absolute top-6 left-6 text-sm text-primary font-bold hover:underline"
            >
              تعديل
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-blue-500"></div>
            <h2 className="text-xl font-bold mb-4 text-secondary flex items-center gap-2">
              <FaWallet className="text-blue-500" /> طريقة الدفع
            </h2>
            <div className="pr-4">
              <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-2 border border-blue-100">
                {paymentMethod === "CashOnDelivery"
                  ? "الدفع عند الاستلام"
                  : paymentMethod}
                <FaCheckCircle />
              </span>
            </div>
            <Link
              to="/payment"
              className="absolute top-6 left-6 text-sm text-blue-600 font-bold hover:underline"
            >
              تعديل
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-secondary flex items-center gap-2 border-b border-gray-50 pb-4">
              <FaBoxOpen className="text-orange-500" /> المنتجات (
              {cartItems.length})
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-4">السلة فارغة</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-1 border border-gray-100 rounded-lg">
                        <img
                          src={item.imageCover}
                          alt={item.name}
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                      <Link
                        to={`/product/${item._id}`}
                        className="hover:text-primary font-bold text-gray-800 transition text-sm sm:text-base"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-gray-600 font-bold text-sm sm:text-base">
                      {item.qty} × {item.price.toLocaleString()} =
                      <span className="text-primary mx-1 font-black">
                        {(item.qty * item.price).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400">ج.م</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold mb-6 text-center text-secondary flex items-center justify-center gap-2">
              <FaReceipt className="text-gray-400" /> ملخص الفاتورة
            </h2>

            <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>قيمة المنتجات</span>
                <span className="font-bold">
                  {itemsPrice.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>تكلفة الشحن</span>
                <span
                  className={`font-bold ${shippingPrice === 0 ? "text-green-600" : "text-orange-600"}`}
                >
                  {shippingPrice === 0 ? "مجاني" : `${shippingPrice} ج.م`}
                </span>
              </div>
              <div className="border-t border-dashed border-gray-300 my-2"></div>
              <div className="flex justify-between items-center text-lg font-black text-primary">
                <span>الإجمالي</span>
                <span>{totalPrice.toLocaleString()} ج.م</span>
              </div>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0}
              className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-secondary/20 disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center gap-2"
            >
              <FaCheckCircle /> تأكيد الطلب نهائياً
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed bg-yellow-50 p-2 rounded-lg border border-yellow-100 text-yellow-700">
              تأكد من صحة رقم هاتفك ({shippingAddress.phone}) لضمان وصول المندوب
              إليك بنجاح.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
