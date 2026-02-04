import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../apis/axios";
import { toast } from "react-toastify";
import {
  FaEnvelope,
  FaLock,
  FaUserEdit,
  FaCamera,
  FaTrash,
  FaUser
} from "react-icons/fa";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) {
      navigate("/login");
    } else {
      const fetchUserData = async () => {
        try {
          const { data } = await axios.get("/api/users/profile", {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          setName(data.name);
          setEmail(data.email);
          setImage(data.image || "");
        } catch (error) {
          setName(userInfo.name);
          setEmail(userInfo.email);
        }
      };
      fetchUserData();
    }
  }, [navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const { data } = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setImage(data);
      setUploading(false);
      toast.info("تم اختيار الصورة.. اضغط حفظ للتأكيد");
    } catch (error) {
      setUploading(false);
      toast.error("فشل رفع الصورة");
    }
  };

  const removeImageHandler = () => {
    if (window.confirm("هل تريد إزالة الصورة الشخصية؟")) {
      setImage("");
      toast.warning("تم إزالة الصورة.. اضغط حفظ للتأكيد");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("كلمة المرور غير متطابقة!");
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.put(
        "/api/users/profile",
        { id: userInfo._id, name, email, password, image },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("تم تحديث البيانات بنجاح ✅");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء التحديث");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-xl font-cairo pb-24 md:pb-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <FaUser className="text-primary" /> الملف الشخصي
        </h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative">
        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center text-4xl text-gray-400 font-bold">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      setImage("");
                    }}
                  />
                ) : (
                  <span>{name?.charAt(0).toUpperCase()}</span>
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">
                    جاري الرفع...
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-green-600 transition active:scale-95 border-2 border-white z-10">
                <FaCamera size={16} />
                <input
                  type="file"
                  className="hidden"
                  onChange={uploadFileHandler}
                />
              </label>
            </div>

            {image && (
              <button
                type="button"
                onClick={removeImageHandler}
                className="text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition"
              >
                <FaTrash size={12} /> حذف الصورة
              </button>
            )}
          </div>

          <div className="h-px bg-gray-100 my-2"></div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-bold mb-2 text-sm">
              <FaUserEdit className="text-primary" /> الاسم الكامل
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-gray-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-bold mb-2 text-sm">
              <FaEnvelope className="text-primary" /> البريد الإلكتروني
            </label>
            <input
              type="email"
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-2xl focus:outline-none focus:border-primary focus:bg-white transition-all text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mt-2">
            <p className="text-xs text-blue-600 font-bold mb-4 text-center">
              تغيير كلمة المرور (اختياري)
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="relative">
                  <div className="absolute top-4 right-4 text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    className="w-full bg-white border border-gray-200 p-3 pr-10 rounded-xl focus:outline-none focus:border-primary transition-all text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="كلمة المرور الجديدة"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute top-4 right-4 text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    className="w-full bg-white border border-gray-200 p-3 pr-10 rounded-xl focus:outline-none focus:border-primary transition-all text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="تأكيد كلمة المرور"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === زر الحفظ (Sticky Bottom on Mobile) === */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:border-0 md:bg-transparent md:p-0 z-20">
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-secondary/20 hover:bg-gray-800 active:scale-95 transition disabled:opacity-70 disabled:scale-100"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
