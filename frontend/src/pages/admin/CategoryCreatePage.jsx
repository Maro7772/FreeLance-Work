import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../apis/axios";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  FaFolderPlus,
  FaCloudUploadAlt,
  FaSpinner,
  FaPen,
  FaCheckCircle,
  FaImage
} from "react-icons/fa";

const CategoryCreatePage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      toast.success("تم رفع الصورة بنجاح 🖼️");
      setUploading(false);
    } catch (error) {
      console.error(error);
      toast.error("فشل رفع الصورة");
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("يرجى رفع صورة للقسم أولاً 🖼️");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/categories",
        { name, image },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("تم إضافة القسم بنجاح! 🎉");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl font-cairo">
      <Breadcrumbs
        pages={[{ name: "لوحة التحكم", url: "/admin/dashboard" }]}
        currentPage="إضافة قسم"
      />

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-secondary flex items-center gap-2 border-b border-gray-100 pb-4">
          <FaFolderPlus className="text-primary" /> تفاصيل القسم الجديد
        </h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              اسم القسم
            </label>
            <div className="relative">
              <FaPen className="absolute right-3 top-4 text-gray-300" />
              <input
                type="text"
                className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl outline-none focus:border-primary bg-gray-50/30 transition-all"
                placeholder="مثال: سماعات، ساعات، جرابات..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm">
              صورة القسم
            </label>
            <div className="border border-dashed border-gray-300 rounded-2xl p-4 bg-gray-50/50">
              <div className="flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 hover:border-primary/50 transition-all overflow-hidden relative group shadow-sm">
                  {image ? (
                    <div className="relative w-full h-full group-hover:opacity-90 transition">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                        <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          تغيير الصورة
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploading ? (
                        <FaSpinner className="text-primary text-3xl animate-spin mb-3" />
                      ) : (
                        <div className="bg-blue-50 p-4 rounded-full mb-3 text-blue-500 group-hover:bg-blue-100 group-hover:scale-110 transition-transform">
                          <FaCloudUploadAlt className="text-3xl" />
                        </div>
                      )}
                      <p className="mb-2 text-sm text-gray-500 font-bold">
                        {uploading ? "جاري الرفع..." : "اضغط لرفع صورة"}
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
                    </div>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    onChange={uploadFileHandler}
                    accept="image/*"
                    disabled={uploading}
                  />
                </label>
              </div>

              {image && (
                <div className="flex items-center gap-2 mt-3 text-xs text-green-600 font-bold bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100 mx-auto">
                  <FaImage /> تم رفع الصورة بنجاح
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-100 disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center gap-2 text-lg"
          >
            {loading ? "جاري الحفظ..." : "حفظ القسم الجديد"}
            {!loading && <FaCheckCircle />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreatePage;
