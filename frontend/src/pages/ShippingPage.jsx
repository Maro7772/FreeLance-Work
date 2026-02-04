import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Breadcrumbs from "../components/Breadcrumbs";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaCity,
  FaPhone,
  FaGlobe,
  FaMailBulk
} from "react-icons/fa";

const ShippingPage = () => {
  const { shippingAddress, saveShippingAddress } = useCart();
  const navigate = useNavigate();

  const cities = [
    "الإسكندرية",
    "القاهرة",
    "الجيزة",
    "طنطا",
    "دمنهور",
    "كفر الشيخ",
    "المنصورة",
    "بورسعيد",
    "السويس",
    "أسيوط",
    "سوهاج"
  ];

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "طنطا");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "مصر");
  const [phone, setPhone] = useState(shippingAddress.phone || "");

  const submitHandler = (e) => {
    e.preventDefault();

    if (phone.length !== 11) {
      toast.error("رقم الهاتف يجب أن يكون 11 رقم بالضبط 📞");
      return;
    }

    saveShippingAddress({ address, city, postalCode, country, phone });
    navigate("/payment");
  };

  // دالة التعامل مع تغيير رقم الهاتف (تسمح بالكتابة والحذف)
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // الشرط: أن يكون أرقام فقط، وأن يكون الطول أقل من أو يساوي 11
    if (value === "" || (/^\d+$/.test(value) && value.length <= 11)) {
      setPhone(value);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl font-cairo">
      <Breadcrumbs
        pages={[{ name: "سلة التسوق", url: "/cart" }]}
        currentPage="عنوان الشحن"
      />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-8 text-secondary flex items-center gap-2 border-b border-gray-100 pb-4">
          <FaMapMarkerAlt className="text-primary" /> بيانات التوصيل
        </h1>

        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          <div>
            <label className="text-sm font-bold text-gray-600 mb-1 block">
              الدولة
            </label>
            <div className="relative">
              <FaGlobe className="absolute right-3 top-4 text-gray-300 z-10" />
              <select
                className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary bg-gray-50/30 font-bold text-gray-700 appearance-none cursor-not-allowed"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled
              >
                <option value="مصر">مصر (Egypt)</option>
                <option value="السعودية">السعودية</option>
                <option value="الإمارات">الإمارات</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-bold text-gray-600 mb-1 block">
                المدينة
              </label>
              <div className="relative">
                <FaCity className="absolute right-3 top-4 text-gray-300 z-10" />
                <select
                  required
                  className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary bg-gray-50/30 font-bold text-gray-700 appearance-none cursor-pointer"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {cities.map((c, index) => (
                    <option key={index} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600 mb-1 block">
                رقم الهاتف (11 رقم)
              </label>
              <div className="relative">
                <FaPhone className="absolute right-3 top-4 text-gray-300" />
                <input
                  type="text"
                  required
                  className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50/30 transition-all font-mono text-left dir-ltr"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="01xxxxxxxxx"
                />
              </div>
              {phone.length > 0 && phone.length < 11 && (
                <p className="text-red-500 text-xs mt-1 font-bold">
                  باقي {11 - phone.length} أرقام
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 mb-1 block">
              العنوان بالتفصيل
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute right-3 top-4 text-gray-300" />
              <input
                type="text"
                required
                className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50/30 transition-all"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="اسم الشارع، رقم العقار، علامة مميزة..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 mb-1 block">
              الرمز البريدي (اختياري)
            </label>
            <div className="relative">
              <FaMailBulk className="absolute right-3 top-4 text-gray-300" />
              <input
                type="text"
                className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50/30 transition-all"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="xxxxx"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-4 rounded-xl font-bold hover:bg-green-600 mt-4 transition shadow-lg shadow-green-100 flex justify-center items-center gap-2"
          >
            حفظ ومتابعة للدفع
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

export default ShippingPage;
