import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../apis/axios";
import { toast } from "react-toastify";
import {
  FaShippingFast,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox
} from "react-icons/fa";

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setOrder(data);
      setLoading(false);
    } catch (error) {
      toast.error("فشل تحميل الطلب");
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrder();
  }, [id]);

  const deliverHandler = async () => {
    try {
      await axios.put(
        `/api/orders/${id}/deliver`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      );
      toast.success("تم تحديث حالة الطلب ✅");
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 font-cairo h-screen">
        جاري التحميل...
      </div>
    );
  if (!order)
    return (
      <div className="text-center mt-20 text-red-500 font-cairo">
        الطلب غير موجود
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-secondary border-b pb-4">
        تفاصيل الطلب{" "}
        <span className="text-primary text-lg">#{order._id.substring(10)}</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="lg:w-2/3 flex flex-col gap-6 w-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-secondary flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> الشحن والتوصيل
            </h2>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>
                <strong>الاسم: </strong> {order.user?.name}
              </p>
              <p>
                <strong>الإيميل: </strong>
                <a
                  href={`mailto:${order.user?.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {order.user?.email}
                </a>
              </p>
              <p>
                <strong>العنوان بالتفصيل: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
            </div>

            {order.isDelivered ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100 flex items-center gap-3">
                <FaShippingFast className="text-xl" />
                <span className="font-bold">
                  تم التوصيل في: {order.deliveredAt.substring(0, 10)}
                </span>
              </div>
            ) : (
              <div className="bg-orange-50 text-orange-700 p-4 rounded-lg border border-orange-100 flex items-center gap-3">
                <FaShippingFast className="text-xl animate-pulse" />
                <span className="font-bold">
                  قيد الشحن / لم يتم التوصيل بعد
                </span>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-secondary flex items-center gap-2">
              <FaCreditCard className="text-primary" /> حالة الدفع
            </h2>
            {order.isPaid ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100 font-bold">
                تم الدفع بنجاح
              </div>
            ) : (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 font-bold">
                لم يتم الدفع (الدفع عند الاستلام)
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-secondary flex items-center gap-2 border-b pb-3">
              <FaBox className="text-primary" /> قائمة المنتجات
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md shadow-sm border border-white"
                    />
                    <Link
                      to={`/product/${item.product}`}
                      className="hover:text-primary font-bold text-gray-800"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-secondary font-bold text-sm bg-white px-3 py-1 rounded shadow-sm">
                    {item.qty} × {item.price.toLocaleString()} ={" "}
                    <span className="text-primary">
                      {(item.qty * item.price).toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3 w-full sticky top-4">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-secondary border-b pb-3">
              ملخص الفاتورة
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>المنتجات</span>
                <span className="font-bold">
                  {order.itemsPrice.toLocaleString()} ج.م
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>مصاريف الشحن</span>
                <span className="font-bold text-green-600">
                  {order.shippingPrice === 0
                    ? "مجاني"
                    : `${order.shippingPrice} ج.م`}
                </span>
              </div>
              <div className="flex justify-between items-center border-t pt-4 text-xl font-bold text-primary">
                <span>الإجمالي</span>
                <span>{order.totalPrice.toLocaleString()} ج.م</span>
              </div>
            </div>

            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <button
                onClick={deliverHandler}
                className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex justify-center items-center gap-2"
              >
                <FaShippingFast /> تم توصيل الطلب للعميل
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
