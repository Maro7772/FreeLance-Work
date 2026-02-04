import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../apis/axios";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaClipboardList,
  FaUserSlash,
  FaTrash,
  FaCalendarAlt
} from "react-icons/fa";
import Breadcrumbs from "../../components/Breadcrumbs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Lottie from "lottie-react";
import emptyAnim from "../../assets/Cardboard Box Open _ Loading 9.json";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.isAdmin) {
      try {
        const { data } = await axios.get("/api/orders", {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        const sortedOrders = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        toast.error("فشل تحميل الطلبات");
        setLoading(false);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        await axios.delete(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        toast.success("تم حذف الطلب بنجاح");
        fetchOrders();
      } catch (error) {
        toast.error(error.response?.data?.message || "حدث خطأ أثناء الحذف");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <Breadcrumbs currentPage="إدارة الطلبات" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 p-3 rounded-2xl">
            <FaClipboardList className="text-3xl text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">إدارة الطلبات</h1>
            <p className="text-gray-400 text-sm font-bold mt-1">
              متابعة وإدارة طلبات العملاء ({orders.length})
            </p>
          </div>
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
        ) : orders.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-64 h-64 mb-4">
              <Lottie animationData={emptyAnim} loop={true} />
            </div>
            <h3 className="text-2xl font-bold text-secondary">
              لا توجد طلبات حتى الآن
            </h3>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto animate-fadeIn">
              <table className="min-w-full text-right">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      رقم الطلب
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      العميل
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      التاريخ
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      الإجمالي
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm text-center">
                      الدفع
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm text-center">
                      التوصيل
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm text-center">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-5 text-gray-400 text-xs font-mono font-bold">
                        #{order._id.substring(20, 24).toUpperCase()}
                      </td>
                      <td className="p-5 font-bold text-gray-800">
                        {order.user?.name || (
                          <span className="text-red-400 text-xs flex items-center gap-1">
                            <FaUserSlash /> محذوف
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-gray-500 text-sm font-bold">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-5">
                        <div className="text-primary font-black text-base">
                          {order.totalPrice.toLocaleString()}{" "}
                          <span className="text-[10px] text-gray-400">ج.م</span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        {order.isPaid ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold border border-green-200">
                            <FaCheck size={10} /> تم الدفع
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold border border-red-200">
                            <FaTimes size={10} /> غير مدفوع
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        {order.isDelivered ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold border border-green-200">
                              <FaCheck size={10} /> تم التوصيل
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {order.deliveredAt?.substring(0, 10)}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-200">
                            <FaTimes size={10} /> قيد التنفيذ
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Link
                            to={`/order/${order._id}`}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm"
                          >
                            <FaEye size={16} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(order._id)}
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
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

            <div className="md:hidden flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-fadeIn"
                >
                  <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block mb-1">
                        رقم الطلب
                      </span>
                      <span className="font-mono font-bold text-secondary">
                        #{order._id.substring(20, 24).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-gray-400 font-bold block mb-1 text-left">
                        التاريخ
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                        <FaCalendarAlt className="text-gray-300" />
                        {order.createdAt.substring(0, 10)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold shadow-sm">
                      {order.user?.name
                        ? order.user.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold">
                        العميل
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {order.user?.name || (
                          <span className="text-red-400 italic">
                            مستخدم محذوف
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div
                      className={`p-2 rounded-lg text-center text-[10px] font-bold border ${order.isPaid ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}
                    >
                      {order.isPaid ? "تم الدفع ✅" : "غير مدفوع ❌"}
                    </div>
                    <div
                      className={`p-2 rounded-lg text-center border flex flex-col items-center justify-center ${order.isDelivered ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-700 border-yellow-100"}`}
                    >
                      <span className="text-[10px] font-bold">
                        {order.isDelivered ? "تم التوصيل 🚚" : "قيد التنفيذ ⏳"}
                      </span>
                      {order.isDelivered && (
                        <span className="text-[8px] opacity-70 font-mono mt-0.5">
                          {order.deliveredAt?.substring(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-100">
                    <div>
                      <span className="text-lg font-black text-primary">
                        {order.totalPrice.toLocaleString()}{" "}
                        <span className="text-[10px]">ج.م</span>
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteHandler(order._id)}
                        className="bg-red-50 text-red-500 p-2 rounded-xl transition hover:bg-red-500 hover:text-white"
                      >
                        <FaTrash size={16} />
                      </button>
                      <Link
                        to={`/order/${order._id}`}
                        className="bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition hover:bg-secondary"
                      >
                        <FaEye /> التفاصيل
                      </Link>
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

export default OrderListPage;
