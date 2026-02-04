import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../apis/axios";
import {
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTruck,
  FaUndo,
  FaTrash,
  FaBoxOpen
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import Breadcrumbs from "../components/Breadcrumbs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-yellow-400 text-sm" dir="ltr">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <FaStar />
            ) : value >= index - 0.5 ? (
              <FaStarHalfAlt />
            ) : (
              <FaRegStar />
            )}
          </span>
        ))}
      </div>
      <span className="text-gray-500 font-bold text-xs pt-1">
        {text && text}
      </span>
    </div>
  );
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      setActiveImage(data.imageCover);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("الرجاء اختيار التقييم ⭐");
      return;
    }
    setLoadingReview(true);
    try {
      await axios.post(
        `/api/products/${id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("تم إضافة التقييم! 🌟");
      setRating(0);
      setComment("");
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "حدث خطأ");
    } finally {
      setLoadingReview(false);
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
      try {
        await axios.delete(`/api/products/${id}/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        toast.success("تم حذف التقييم");
        fetchProduct();
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo">
        <div className="mb-6">
          <Skeleton width={200} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <Skeleton height={400} borderRadius="1rem" className="mb-4" />
            <div className="flex gap-3">
              <Skeleton width={80} height={80} borderRadius="0.75rem" />
              <Skeleton width={80} height={80} borderRadius="0.75rem" />
              <Skeleton width={80} height={80} borderRadius="0.75rem" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton height={40} width={`80%`} />
            <Skeleton height={20} width={150} />
            <Skeleton height={50} width={200} />
            <Skeleton count={4} />
            <Skeleton height={150} borderRadius="1rem" className="mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <div className="text-center mt-20 text-red-500 font-cairo font-bold text-xl">
        المنتج غير موجود 😔
      </div>
    );

  const uniqueImages = [
    ...new Set([product.imageCover, ...(product.images || [])])
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo animate-fadeIn">
      <Breadcrumbs currentPage={product.name} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 mb-12">
        <div>
          <div className="flex justify-center items-center bg-gray-50 rounded-2xl p-6 mb-6 h-[450px] border border-gray-50 overflow-hidden relative group">
            <img
              src={activeImage}
              alt={product.name}
              className="max-w-full h-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 justify-start md:justify-center scrollbar-hide">
            {uniqueImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`product-${index}`}
                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                  activeImage === img
                    ? "border-primary scale-105 shadow-md ring-2 ring-green-50"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-secondary mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <Rating
                value={product.rating}
                text={`${product.numReviews} تقييم`}
              />
            </div>

            <div className="flex items-center gap-2">
              <FaBoxOpen
                className={
                  product.countInStock > 0 ? "text-green-500" : "text-red-500"
                }
              />
              <span
                className={`text-sm font-bold ${product.countInStock > 0 ? "text-green-600" : "text-red-500"}`}
              >
                {product.countInStock > 0 ? "متوفر" : "نفذت الكمية"}
              </span>
              {product.countInStock > 0 && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.countInStock < 5 ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-500"}`}
                >
                  (المتبقي: {product.countInStock})
                </span>
              )}
            </div>
          </div>

          <div className="mb-8 flex items-center gap-4 bg-gray-50 w-fit p-4 rounded-2xl border border-gray-100">
            {product.priceAfterDiscount &&
            product.priceAfterDiscount < product.price ? (
              <>
                <span className="text-4xl font-black text-primary">
                  {product.priceAfterDiscount.toLocaleString()}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-400 line-through decoration-red-400 decoration-2">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 font-bold">ج.م</span>
                </div>
              </>
            ) : (
              <>
                <span className="text-4xl font-black text-primary">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xl text-gray-400 font-bold mt-2">
                  ج.م
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 text-lg">
            {product.description}
          </p>

          <div className="flex gap-6 mb-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FaTruck className="text-secondary text-lg" /> شحن سريع
            </div>
            <div className="flex items-center gap-2">
              <FaUndo className="text-secondary text-lg" /> استرجاع خلال 14 يوم
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-700">حدد الكمية:</span>
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-200">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-gray-100 flex items-center justify-center font-bold text-lg text-secondary transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-xl w-8 text-center text-primary">
                    {qty}
                  </span>
                  <button
                    onClick={() =>
                      setQty(Math.min(product.countInStock, qty + 1))
                    }
                    className="w-8 h-8 rounded-lg bg-white shadow-sm hover:bg-gray-100 flex items-center justify-center font-bold text-lg text-secondary transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-3 transition-all shadow-lg transform active:scale-95 ${
                product.countInStock > 0
                  ? "bg-secondary text-white hover:bg-gray-800 shadow-secondary/20"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              }`}
              onClick={() => {
                const finalPrice =
                  product.priceAfterDiscount &&
                  product.priceAfterDiscount < product.price
                    ? product.priceAfterDiscount
                    : product.price;
                addToCart({ ...product, price: finalPrice }, qty);
                navigate("/cart");
              }}
              disabled={product.countInStock === 0}
            >
              <FaShoppingCart className="text-xl" />
              {product.countInStock > 0 ? "إضافة إلى السلة" : "نفذت الكمية"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-secondary flex items-center gap-3">
            آراء العملاء
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {product.numReviews}
            </span>
          </h2>

          {(!product.reviews || product.reviews.length === 0) && (
            <div className="bg-gray-50 text-gray-500 p-6 rounded-2xl border border-dashed border-gray-200 text-center font-bold">
              كن أول من يقيم هذا المنتج! 🌟
            </div>
          )}

          <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {product.reviews?.map((review) => (
              <div
                key={review._id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group transition hover:shadow-md"
              >
                {userInfo &&
                  (review.user === userInfo._id || userInfo.isAdmin) && (
                    <button
                      onClick={() => deleteReviewHandler(review._id)}
                      className="absolute top-4 left-4 text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                      title="حذف التقييم"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}

                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-gray-700 text-white flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden border border-gray-100">
                      {review.image ? (
                        <img
                          src={review.image}
                          alt={review.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-gray-700 text-white font-bold text-lg"
                          style={{ display: review.image ? "none" : "flex" }} // مخفي لو فيه صورة
                        >
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div>
                      <strong className="text-sm text-gray-800 block">
                        {review.name}
                      </strong>
                      <Rating value={review.rating} />
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 bg-gray-50/50 p-3 rounded-xl leading-relaxed text-sm border border-gray-50">
                  {review.comment}
                </p>
                <span className="text-[10px] text-gray-400 mt-2 block text-left px-1">
                  {review.createdAt?.substring(0, 10)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8 text-secondary">أضف تقييمك</h2>
          {userInfo ? (
            <form
              onSubmit={submitHandler}
              className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 sticky top-4"
            >
              <div className="mb-6">
                <label className="block font-bold mb-3 text-gray-700">
                  تقييمك للمنتج
                </label>
                <div className="relative">
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-1 focus:ring-primary outline-none font-bold text-gray-700 bg-gray-50 appearance-none cursor-pointer"
                  >
                    <option value="0">اختر النجوم...</option>
                    <option value="5">⭐⭐⭐⭐⭐ - ممتاز</option>
                    <option value="4">⭐⭐⭐⭐ - جيد جداً</option>
                    <option value="3">⭐⭐⭐ - جيد</option>
                    <option value="2">⭐⭐ - مقبول</option>
                    <option value="1">⭐ - سيء</option>
                  </select>
                  <div className="absolute left-3 top-4 text-gray-400 pointer-events-none text-xs">
                    ▼
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block font-bold mb-3 text-gray-700">
                  تعليقك
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-200 p-4 rounded-xl h-32 focus:ring-1 focus:ring-primary outline-none resize-none placeholder-gray-400 bg-gray-50"
                  placeholder="ما رأيك في الجودة والسعر؟"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loadingReview}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-100 disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center gap-2"
              >
                {loadingReview ? "جاري النشر..." : "نشر التقييم"}
              </button>
            </form>
          ) : (
            <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 text-center text-orange-800 flex flex-col items-center gap-4">
              <span className="text-4xl">🔐</span>
              <p>يجب عليك تسجيل الدخول لتتمكن من إضافة تقييم.</p>
              <Link
                to="/login"
                className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition shadow-md"
              >
                تسجيل الدخول
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
