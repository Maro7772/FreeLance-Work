import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaBoxOpen } from "react-icons/fa";
import axios from "../../apis/axios";
import { toast } from "react-toastify";
import Breadcrumbs from "../components/Breadcrumbs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Lottie from "lottie-react";
import emptyAnim from "../assets/Cardboard Box Open _ Loading 9.json";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        toast.success("تم حذف المنتج");
        fetchProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || "حدث خطأ أثناء الحذف");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <Breadcrumbs currentPage="إدارة المنتجات" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 p-3 rounded-2xl">
            <FaBoxOpen className="text-3xl text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">المنتجات</h1>
            <p className="text-gray-400 text-sm font-bold mt-1">
              قائمة بجميع المنتجات المتاحة
            </p>
          </div>
        </div>

        <Link
          to="/admin/product/create"
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-green-700 transition shadow-lg shadow-green-100 font-bold"
        >
          <FaPlus /> إنشاء منتج جديد
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <Skeleton width={120} height={30} />
              <Skeleton width={150} height={40} />
            </div>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-4 w-1/3">
                    <Skeleton width={40} height={40} borderRadius={8} />
                    <Skeleton width={`70%`} />
                  </div>
                  <Skeleton width={80} />
                  <Skeleton width={100} />
                  <div className="flex gap-2">
                    <Skeleton width={35} height={35} borderRadius={8} />
                    <Skeleton width={35} height={35} borderRadius={8} />
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-bold bg-red-50">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-64 h-64 mb-4">
              <Lottie animationData={emptyAnim} loop={true} />
            </div>
            <h3 className="text-2xl font-bold text-secondary">
              لا توجد منتجات
            </h3>
            <p className="text-gray-400 mt-2 mb-6">أضف منتجاتك لتبدأ البيع</p>
            <Link
              to="/admin/product/create"
              className="text-primary font-bold hover:underline"
            >
              إضافة منتج الآن
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto animate-fadeIn">
            <table className="min-w-full text-right">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="p-5 text-gray-500 font-bold text-sm">ID</th>
                  <th className="p-5 text-gray-500 font-bold text-sm">الاسم</th>
                  <th className="p-5 text-gray-500 font-bold text-sm">السعر</th>
                  <th className="p-5 text-gray-500 font-bold text-sm">القسم</th>
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
                    <td className="p-5 text-gray-400 text-xs font-mono font-bold">
                      #{product._id.substring(20, 24).toUpperCase()}
                    </td>
                    <td className="p-5 font-bold text-gray-800 text-base">
                      {product.name}
                    </td>
                    <td className="p-5">
                      <div className="text-primary font-black text-lg">
                        {product.price.toLocaleString()}
                        <span className="text-[10px] text-gray-400 mr-1 font-cairo">
                          ج.م
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100">
                        {product.category?.name ||
                          product.category ||
                          "غير محدد"}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="bg-gray-100 text-gray-500 p-2.5 rounded-xl hover:bg-primary hover:text-white transition shadow-sm"
                          title="تعديل"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm"
                          title="حذف"
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
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
