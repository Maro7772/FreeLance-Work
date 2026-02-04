import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../apis/axios";
import { toast } from "react-toastify";
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // أيقونات احترافية

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/users", {
        name,
        email,
        password
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      toast.success("مرحباً بك في متجر سعد! تم إنشاء الحساب 🎉");
      setLoading(false);

      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التسجيل");
      setLoading(false);
    }
  };

  return (
    // استخدام نفس الـ Container والـ Layout الموحد للموقع
    <div className="container mx-auto px-4 flex justify-center items-center min-h-[85vh] font-cairo py-10">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        {/* رأس الصفحة مع أيقونة مميزة */}
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex justify-center items-center mx-auto mb-4">
            <FaUserPlus className="text-primary text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-secondary">حساب جديد</h1>
          <p className="text-gray-400 mt-2 text-sm">
            انضم إلينا اليوم واستمتع بأفضل العروض
          </p>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col gap-4">
          {/* حقل الاسم */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block mr-1">
              الاسم الكامل
            </label>
            <div className="relative">
              <FaUser className="absolute right-3 top-3.5 text-gray-300" />
              <input
                type="text"
                placeholder="اكتب اسمك الثنائي"
                className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* حقل البريد الإلكتروني */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block mr-1">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <FaEnvelope className="absolute right-3 top-3.5 text-gray-300" />
              <input
                type="email"
                placeholder="example@mail.com"
                className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/30"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block mr-1">
              كلمة المرور
            </label>
            <div className="relative">
              <FaLock className="absolute right-3 top-3.5 text-gray-300" />
              <input
                type="password"
                placeholder="********"
                className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block mr-1">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <FaLock className="absolute right-3 top-3.5 text-gray-300" />
              <input
                type="password"
                placeholder="********"
                className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/30"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 px-4 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-100 mt-4 disabled:bg-gray-400 disabled:shadow-none flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                جاري التحميل...
              </span>
            ) : (
              "إنشاء حساب جديد"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-gray-500 text-sm">
            لديك حساب بالفعل؟{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline transition-all"
            >
              سجل دخولك هنا
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
