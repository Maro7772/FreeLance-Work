import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  FaMoneyBillWave,
  FaWallet,
  FaCheckCircle,
  FaCreditCard
} from "react-icons/fa";

const PaymentPage = () => {
  const { savePaymentMethod, shippingAddress } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate("/placeorder");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl font-cairo">
      <Breadcrumbs
        pages={[
          { name: "سلة التسوق", url: "/cart" },
          { name: "عنوان الشحن", url: "/shipping" }
        ]}
        currentPage="طريقة الدفع"
      />
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-8 text-secondary flex items-center gap-2 border-b border-gray-100 pb-4">
          <FaWallet className="text-primary" /> اختر وسيلة الدفع
        </h1>

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          <label
            className={`relative flex items-center gap-4 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
            ${
              paymentMethod === "CashOnDelivery"
                ? "border-primary bg-green-50/50 shadow-md"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="CashOnDelivery"
              checked={paymentMethod === "CashOnDelivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="hidden"
            />

            <div
              className={`p-3 rounded-full ${paymentMethod === "CashOnDelivery" ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}
            >
              <FaMoneyBillWave className="text-xl" />
            </div>

            <div className="flex-1">
              <span
                className={`block font-bold text-lg ${paymentMethod === "CashOnDelivery" ? "text-secondary" : "text-gray-600"}`}
              >
                الدفع عند الاستلام
              </span>
              <span className="text-sm text-gray-400">
                ادفع نقداً لمندوب الشحن عند وصول طلبك
              </span>
            </div>

            {paymentMethod === "CashOnDelivery" && (
              <FaCheckCircle className="text-2xl text-primary animate-bounce" />
            )}
          </label>

          <label className="relative flex items-center gap-4 p-6 rounded-2xl border-2 border-gray-100 opacity-60 cursor-not-allowed grayscale">
            <div className="p-3 rounded-full bg-gray-100 text-gray-400">
              <FaCreditCard className="text-xl" />
            </div>
            <div className="flex-1">
              <span className="block font-bold text-lg text-gray-500 flex items-center gap-2">
                بطاقة ائتمان / خصم مباشر
                <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  قريباً
                </span>
              </span>
              <span className="text-sm text-gray-400">
                Visa, Mastercard, Meeza
              </span>
            </div>
          </label>

          <button
            type="submit"
            className="bg-primary text-white py-4 rounded-xl font-bold hover:bg-green-600 mt-6 transition shadow-lg shadow-green-100 flex justify-center items-center gap-2"
          >
            متابعة للمراجعة النهائية
            <svg
              className="w-5 h-5 rtl:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
