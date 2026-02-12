import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBoxOpen,
  FaFolderPlus,
  FaLayerGroup,
  FaImage,
  FaList
} from "react-icons/fa";
import axios from "../../apis/axios";
import Breadcrumbs from "../../components/Breadcrumbs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Lottie from "lottie-react";
import emptyAnim from "../../assets/Cardboard Box Open _ Loading 9.json";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
      setLoading(false);
    } catch (error) {
      toast.error("فشل في جلب المنتجات");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        toast.success("تم الحذف بنجاح");
        fetchProducts();
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <Breadcrumbs currentPage="لوحة التحكم" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-secondary/10 p-3 rounded-2xl">
            <FaBoxOpen className="text-3xl text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">المنتجات</h1>
            <p className="text-gray-400 text-sm font-bold mt-1">
              إدارة المخزون ({products.length} منتج)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            to="/admin/category/create"
            className="flex-1 md:flex-none bg-white text-secondary border border-gray-200 px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm font-bold"
          >
            <FaFolderPlus className="text-primary" /> قسم جديد
          </Link>
          <Link
            to="/admin/categories"
            className="flex-1 md:flex-none bg-blue-50 text-blue-600 border border-blue-100 px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition shadow-sm font-bold"
          >
            <FaList /> عرض الأقسام
          </Link>

          <Link
            to="/admin/product/create"
            className="flex-1 md:flex-none bg-primary text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-100 font-bold"
          >
            <FaPlus /> منتج جديد
          </Link>
        </div>
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
        ) : products.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-64 h-64 mb-4">
              <Lottie animationData={emptyAnim} loop={true} />
            </div>
            <h3 className="text-2xl font-bold text-secondary">
              المخزن فارغ حالياً
            </h3>
            <Link
              to="/admin/product/create"
              className="text-primary font-bold hover:underline mt-4 flex items-center gap-2"
            >
              <FaPlus /> أضف منتجك الأول
            </Link>
          </div>
        ) : (
          <>
            {/* ================= جدول الديسك توب ================= */}
            <div className="hidden md:block overflow-x-auto animate-fadeIn text-center">
              <table className="min-w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      الصورة
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm text-right">
                      المنتج
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      السعر
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      القسم
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-5">
                        <div className="flex justify-center">
                          {product.imageCover ? (
                            <img
                              src={product.imageCover}
                              alt={product.name}
                              className="w-12 h-12 object-contain bg-gray-50 rounded-lg border border-gray-100 shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                              <FaImage />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <div className="font-bold text-gray-800 text-base">
                          {product.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          #{product._id.substring(20, 24).toUpperCase()}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-primary font-black text-lg">
                          {product.price.toLocaleString()}{" "}
                          <span className="text-[10px] text-gray-400 mr-1">
                            ج.م
                          </span>
                        </div>
                        <div
                          className={`text-[10px] font-bold ${product.countInStock < 5 ? "text-red-500 animate-pulse" : "text-gray-400"}`}
                        >
                          المخزن: {product.countInStock}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                          {product.category?.name || "عام"}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/product/${product._id}/edit`}
                            className="bg-gray-100 text-gray-500 p-2.5 rounded-xl hover:bg-primary hover:text-white transition shadow-sm"
                          >
                            <FaEdit size={16} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(product._id)}
                            className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================= كروت الموبايل ================= */}
            <div className="md:hidden flex flex-col gap-4 animate-fadeIn">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {/* الصورة في الموبايل */}
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={product.imageCover || product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-gray-400 font-mono font-bold">
                          #{product._id.substring(20, 24).toUpperCase()}
                        </span>
                        <div className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                          <FaLayerGroup size={8} />{" "}
                          {product.category?.name || "عام"}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm truncate mt-1">
                        {product.name}
                      </h3>
                      <div className="text-primary font-black text-lg mt-1">
                        {product.price.toLocaleString()}{" "}
                        <span className="text-[10px] font-normal">ج.م</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
                    <span
                      className={`text-xs font-bold ${product.countInStock < 5 ? "text-red-500" : "text-gray-500"}`}
                    >
                      المخزن: {product.countInStock} قطعة
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="bg-gray-100 text-gray-500 p-2 rounded-xl flex items-center gap-1 text-xs font-bold"
                      >
                        <FaEdit /> تعديل
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="bg-red-50 text-red-600 p-2 rounded-xl flex items-center gap-1 text-xs font-bold"
                      >
                        <FaTrash /> حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
