import axios from "../apis/axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/");
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      toast.success("مرحباً بك مجدداً! ✨");
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );
    }
  };

  return (
    <div className="container mx-auto px-4 flex justify-center items-center min-h-[80vh] font-cairo">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex justify-center items-center mx-auto mb-4">
            <FaSignInAlt className="text-primary text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-secondary">تسجيل الدخول</h1>
          <p className="text-gray-400 mt-2 text-sm">
            أهلاً بك في متجر سعد، سجل دخولك للمتابعة
          </p>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          <div className="relative">
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

          <div className="relative">
            <div className="flex justify-between items-center mb-1 mr-1">
              <label className="text-xs font-bold text-gray-500 block">
                كلمة المرور
              </label>
            </div>
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

          <button
            type="submit"
            className="bg-secondary text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-100 mt-2 flex justify-center items-center gap-2"
          >
            دخول للمتجر
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-gray-500 text-sm">
            مستخدم جديد؟{" "}
            <Link
              to="/register"
              className="text-primary font-bold hover:underline transition-all"
            >
              انضم إلينا الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
