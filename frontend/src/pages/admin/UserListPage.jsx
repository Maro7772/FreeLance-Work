import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../apis/axios";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaUsers,
  FaUserShield,
  FaUser,
  FaEnvelope,
  FaFingerprint
} from "react-icons/fa";
import Breadcrumbs from "../../components/Breadcrumbs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Lottie from "lottie-react";
import emptyAnim from "../../assets/Cardboard Box Open _ Loading 9.json";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // دالة لتوليد لون خلفية بناءً على اسم المستخدم لمنع التكرار
  const getAvatarStyle = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-red-500"
    ];
    const charCodeSum = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const fetchUsers = async () => {
    if (userInfo && userInfo.isAdmin) {
      try {
        const { data } = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setUsers(data);
        setLoading(false);
      } catch (error) {
        toast.error("فشل تحميل قائمة المستخدمين");
        setLoading(false);
      }
    } else {
      navigate("/login");
    }
  };

  const toggleAdminHandler = async (user) => {
    const action = user.isAdmin ? "سحب صلاحيات الأدمن" : "ترقية لمشرف (أدمن)";
    if (window.confirm(`هل أنت متأكد من ${action} من المستخدم ${user.name}؟`)) {
      try {
        await axios.put(
          `/api/users/${user._id}`,
          { isAdmin: !user.isAdmin },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );

        toast.success(`تم تحديث صلاحيات ${user.name} بنجاح`);

        if (user._id === userInfo._id) {
          toast.info("لقد قمت بتعديل صلاحياتك، يرجى تسجيل الدخول مرة أخرى.");
          setTimeout(() => {
            localStorage.removeItem("userInfo");
            navigate("/login");
            window.location.reload();
          }, 2000);
          return;
        }

        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "حدث خطأ أثناء التحديث");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟")) {
      try {
        await axios.delete(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        toast.success("تم حذف الحساب بنجاح");
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "حدث خطأ أثناء الحذف");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
      <Breadcrumbs currentPage="إدارة المستخدمين" />

      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <div className="bg-secondary/10 p-3 rounded-2xl">
          <FaUsers className="text-3xl text-secondary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            المستخدمين
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-1">
            إدارة حسابات العملاء والمشرفين ({users.length})
          </p>
        </div>
      </div>

      <div className="bg-white md:rounded-3xl md:shadow-sm md:border md:border-gray-100 md:overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            <Skeleton height={50} borderRadius="1rem" count={5} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-64 h-64 mb-4">
              <Lottie animationData={emptyAnim} loop={true} />
            </div>
            <h3 className="text-2xl font-bold text-secondary">
              لا يوجد مستخدمين
            </h3>
          </div>
        ) : (
          <>
            {/* ================= جدول الديسك توب ================= */}
            <div className="hidden md:block overflow-x-auto animate-fadeIn">
              <table className="min-w-full text-center">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="p-5 text-gray-500 font-bold text-sm">ID</th>
                    <th className="p-5 text-gray-500 font-bold text-sm text-right">
                      الاسم
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      الإيميل
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      الرتبة
                    </th>
                    <th className="p-5 text-gray-500 font-bold text-sm">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-5 text-gray-400 text-xs font-mono font-bold">
                        #{user._id.substring(20, 24).toUpperCase()}
                      </td>

                      <td className="p-5 text-right">
                        <div className="flex items-center gap-3 justify-start">
                          <div
                            className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white font-bold shadow-sm ${user.image ? "" : getAvatarStyle(user.name)}`}
                          >
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span
                            className="font-bold text-gray-800 truncate max-w-[200px]"
                            title={user.name}
                          >
                            {user.name} {user._id === userInfo._id && "(أنت)"}
                          </span>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex justify-center">
                          <a
                            href={`mailto:${user.email}`}
                            className="text-gray-600 hover:text-primary transition text-sm font-bold flex items-center gap-2"
                          >
                            <FaEnvelope className="opacity-30" /> {user.email}
                          </a>
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="flex justify-center">
                          {user.isAdmin ? (
                            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                              <FaUserShield className="text-[10px]" /> مشرف
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold border border-gray-200">
                              <FaUser className="text-[10px]" /> عميل
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => toggleAdminHandler(user)}
                            className={`p-2 rounded-xl transition ${user.isAdmin ? "bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white" : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white"}`}
                            title="تغيير الرتبة"
                          >
                            <FaUserShield size={16} />
                          </button>
                          {!user.isAdmin && (
                            <button
                              onClick={() => deleteHandler(user._id)}
                              className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
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
            </div>

            {/* ================= كروت المبايل ================= */}
            <div className="md:hidden flex flex-col gap-4 animate-fadeIn">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center"
                >
                  <div className="flex flex-col items-center mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-white font-bold text-2xl shadow-md mb-3 ${user.image ? "" : getAvatarStyle(user.name)}`}
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {user.name} {user._id === userInfo._id && "(أنت)"}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">
                      ID: #{user._id.substring(18, 24).toUpperCase()}
                    </span>

                    <div className="mt-2">
                      {user.isAdmin ? (
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                          <FaUserShield /> مشرف
                        </span>
                      ) : (
                        <span className="bg-gray-50 text-gray-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-gray-100 flex items-center gap-1">
                          <FaUser /> عميل
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-5 flex justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 px-4 rounded-lg">
                      <FaEnvelope className="text-gray-400" /> {user.email}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-gray-100">
                    <button
                      onClick={() => toggleAdminHandler(user)}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${user.isAdmin ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-green-50 text-green-600 border border-green-100"}`}
                    >
                      <FaFingerprint />{" "}
                      {user.isAdmin ? "سحب رتبة" : "ترقية أدمن"}
                    </button>

                    {!user.isAdmin ? (
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-bold"
                      >
                        <FaTrash /> حذف الحساب
                      </button>
                    ) : (
                      <div className="flex items-center justify-center text-[10px] text-gray-400 font-bold italic">
                        لا يمكن حذف المشرف
                      </div>
                    )}
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

export default UserListPage;
