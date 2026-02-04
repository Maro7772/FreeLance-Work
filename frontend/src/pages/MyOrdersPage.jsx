import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../apis/axios";
import {
  FaEye,
  FaBoxOpen,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTruck,
  FaShoppingBag,
  FaTrash
} from "react-icons/fa";
import Breadcrumbs from "../components/Breadcrumbs";
import Lottie from "lottie-react";
import emptyAnim from "../assets/Cardboard Box Open _ Loading 9.json";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify"; // نسينا دي في الكود اللي فات

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // دالة لجلب الطلبات (خرجناها برة useEffect عشان نستخدمها بعد الحذف)
  const fetchMyOrders = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.get("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      // الترتيب: الأحدث أولاً
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // 👇 دالة حذف الطلب
  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "هل أنت متأكد من إلغاء هذا الطلب؟ سيتم استرجاع المنتجات للمخزن."
      )
    ) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        await axios.delete(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        toast.success("تم إلغاء الطلب بنجاح 🗑️");
        // تحديث القائمة بعد الحذف
        fetchMyOrders();
      } catch (error) {
        toast.error(error.response?.data?.message || "حدث خطأ أثناء الإلغاء");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <Breadcrumbs currentPage="طلباتي" />

      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <FaBoxOpen className="text-3xl text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-secondary">
          سجل الطلبات
        </h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton height={80} count={5} borderRadius="1rem" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm text-center">
          <div className="w-48 h-48 md:w-64 md:h-64 mb-4">
            {emptyAnim ? (
              <Lottie animationData={emptyAnim} loop={true} />
            ) : (
              <FaShoppingBag className="text-6xl text-gray-200" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">
            ليس لديك أي طلبات سابقة
          </h2>
          <p className="text-gray-400 mb-6">
            لم تقم بشراء أي منتج بعد، تصفح المتجر واكتشف عروضنا.
          </p>
          <Link
            to="/"
            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center gap-2"
          >
            <FaShoppingBag /> ابدأ التسوق الآن
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* ================= جدول الديسك توب ================= */}
          <table className="min-w-full hidden md:table">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-right font-bold text-gray-500 text-sm">
                  رقم الطلب
                </th>
                <th className="py-4 px-6 text-right font-bold text-gray-500 text-sm">
                  التاريخ
                </th>
                <th className="py-4 px-6 text-right font-bold text-gray-500 text-sm">
                  الإجمالي
                </th>
                <th className="py-4 px-6 text-center font-bold text-gray-500 text-sm">
                  الدفع
                </th>
                <th className="py-4 px-6 text-center font-bold text-gray-500 text-sm">
                  التوصيل
                </th>
                <th className="py-4 px-6 text-center font-bold text-gray-500 text-sm">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50/80 transition group"
                >
                  <td className="py-4 px-6 text-sm font-mono text-gray-600">
                    #{order._id.substring(20, 24).toUpperCase()}
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-700">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="py-4 px-6 font-black text-primary text-base">
                    {order.totalPrice.toLocaleString()} ج.م
                  </td>

                  <td className="py-4 px-6 text-center">
                    {order.isPaid ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold border border-green-200">
                        <FaMoneyBillWave /> تم الدفع
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-lg text-xs font-bold border border-orange-200">
                        <FaMoneyBillWave /> عند الاستلام
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-center">
                    {order.isDelivered ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold border border-green-200">
                        <FaTruck /> تم التوصيل
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold border border-blue-200">
                        <FaTruck /> جاري التجهيز
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex justify-center items-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-primary hover:text-white transition shadow-sm"
                        title="عرض التفاصيل"
                      >
                        <FaEye />
                      </Link>

                      {/* زر الحذف يظهر فقط إذا لم يتم التوصيل */}
                      {!order.isDelivered && (
                        <button
                          onClick={() => deleteHandler(order._id)}
                          className="inline-flex justify-center items-center w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
                          title="إلغاء الطلب"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= كروت الموبايل ================= */}
          <div className="md:hidden flex flex-col gap-4 p-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative"
              >
                <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                  <div>
                    <span className="text-xs text-gray-400 font-bold block mb-1">
                      رقم الطلب
                    </span>
                    <span className="font-mono font-bold text-secondary">
                      #{order._id.substring(20, 24).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-gray-400 font-bold block mb-1">
                      التاريخ
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                      <FaCalendarAlt className="text-gray-300" />
                      {order.createdAt.substring(0, 10)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-lg font-bold ${order.isPaid ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                    >
                      {order.isPaid ? "مدفوع" : "غير مدفوع"}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-lg font-bold ${order.isDelivered ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {order.isDelivered ? "تم التوصيل" : "جاري التجهيز"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-gray-200">
                  <span className="text-lg font-black text-primary">
                    {order.totalPrice.toLocaleString()} ج.م
                  </span>

                  <div className="flex gap-2">
                    {/* زر الحذف في الموبايل */}
                    {!order.isDelivered && (
                      <button
                        onClick={() => deleteHandler(order._id)}
                        className="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition"
                      >
                        إلغاء
                      </button>
                    )}
                    <Link
                      to={`/order/${order._id}`}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-secondary transition"
                    >
                      <FaEye /> التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
