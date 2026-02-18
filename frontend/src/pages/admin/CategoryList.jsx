import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaLayerGroup, FaImage, FaPlus } from "react-icons/fa";
import axios from "../../apis/axios";
import Breadcrumbs from "../../components/Breadcrumbs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Lottie from "lottie-react";
import emptyAnim from "../../assets/Cardboard Box Open _ Loading 9.json";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories");
      setCategories(data);
      setLoading(false);
    } catch (error) {
      toast.error("فشل في جلب الأقسام");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchCategories();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "هل أنت متأكد من حذف هذا القسم؟ سيتم حذف المنتجات المرتبطة به إن وجدت!"
      )
    ) {
      try {
        await axios.delete(`/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        toast.success("تم حذف القسم بنجاح");
        fetchCategories();
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <Breadcrumbs
        pages={[{ name: "لوحة التحكم", url: "/admin/dashboard" }]}
        currentPage={"إدارة الأقسام"}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-blue-50 p-3 rounded-2xl">
            <FaLayerGroup className="text-3xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">الأقسام</h1>
            <p className="text-gray-400 text-sm font-bold mt-1">
              إدارة التصنيفات ({categories.length} قسم)
            </p>
          </div>
        </div>

        <Link
          to="/admin/category/create"
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-100 font-bold w-full md:w-auto"
        >
          <FaPlus /> إضافة قسم جديد
        </Link>
      </div>

      <div className="bg-white md:rounded-3xl md:shadow-sm md:border md:border-gray-100 md:overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton
              height={60}
              count={5}
              borderRadius="1rem"
              className="mb-4"
            />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-64 h-64 mb-4">
              <Lottie animationData={emptyAnim} loop={true} />
            </div>
            <h3 className="text-2xl font-bold text-secondary">
              لا توجد أقسام حالياً
            </h3>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto animate-fadeIn text-center">
              <table className="min-w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      صورة القسم
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm text-right">
                      اسم القسم
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      تاريخ الإنشاء
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="flex justify-center">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-16 h-16 object-cover bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                              <FaImage size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="font-bold text-gray-800 text-lg">
                          {category.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                          ID: {category._id}
                        </div>
                      </td>
                      <td className="p-5 text-gray-500 font-medium text-sm">
                        {new Date(category.createdAt).toLocaleDateString(
                          "ar-EG"
                        )}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => deleteHandler(category._id)}
                            className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm flex items-center gap-2 font-bold text-sm"
                          >
                            <FaTrash /> حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col gap-4 p-4 animate-fadeIn">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(category.createdAt).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteHandler(category._id)}
                    className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
