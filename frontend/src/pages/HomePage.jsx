import { useEffect, useState } from "react";
import axios from "../apis/axios";
import Product from "../components/Product";
import ProductSkeleton from "../components/ProductSkeleton";
import Lottie from "lottie-react";
import splashAnim from "../assets/Cart Icon Loader.json";
import emptyAnim from "../assets/Cardboard Box Open _ Loading 9.json";
import { useParams } from "react-router-dom";
import { FaFire, FaThLarge, FaCheckCircle, FaLayerGroup } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const { keyword } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!isFirstLoad) {
        setLoading(true);
      }

      try {
        if (categories.length === 0) {
          const { data: cats } = await axios.get("/api/categories");
          setCategories(cats);
        }

        const { data: prods } = await axios.get(
          `/api/products?keyword=${keyword || ""}&category=${activeCategory}`
        );
        setProducts(prods);

        setLoading(false);
        setTimeout(() => setIsFirstLoad(false), 1500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setIsFirstLoad(false);
      }
    };

    fetchData();
  }, [keyword, activeCategory]);

  if (isFirstLoad) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center font-cairo bg-[#f8f9fa]">
        <div className="w-48 h-48 md:w-64 md:h-64">
          <Lottie animationData={splashAnim} loop={true} />
        </div>
        <p className="mt-4 text-xl font-bold text-secondary animate-pulse">
          جاري تجهيز المتجر...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="container mx-auto px-4 py-8 max-w-6xl font-cairo animate-fadeIn">
        {!keyword && (
          <div className="mb-12">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
                <FaLayerGroup className="text-primary" /> تصفح الأقسام
              </h2>
              {activeCategory && !loading && (
                <button
                  onClick={() => setActiveCategory("")}
                  className="text-sm text-gray-500 hover:text-primary transition-colors font-bold underline"
                >
                  عرض الكل
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-32 rounded-2xl overflow-hidden shadow-sm bg-white" // جعلنا حاوية السكيلتون بيضاء
                    >
                      <Skeleton
                        height="100%"
                        borderRadius="1rem"
                        baseColor="#e5e7eb"
                        highlightColor="#f3f4f6"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div
                  onClick={() => setActiveCategory("")}
                  className={`relative h-32 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-sm
                    ${activeCategory === "" ? "ring-4 ring-primary ring-offset-2 scale-[1.02]" : "hover:shadow-lg hover:-translate-y-1"}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 transition-colors ${activeCategory === "" ? "from-primary to-green-700" : ""}`}
                  ></div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
                    <FaThLarge className="text-3xl mb-2 opacity-80" />
                    <span className="font-bold text-lg">الكل</span>
                  </div>
                </div>

                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => setActiveCategory(cat._id)}
                    className={`relative h-32 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-sm
                      ${activeCategory === cat._id ? "ring-4 ring-primary ring-offset-2 scale-[1.02] shadow-xl" : "hover:shadow-lg hover:-translate-y-1 grayscale-[0.3] hover:grayscale-0 bg-white"}`}
                  >
                    <img
                      src={cat.image || "https://via.placeholder.com/300"}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30 ${activeCategory === cat._id ? "bg-primary/20" : ""}`}
                    ></div>
                    <div className="absolute bottom-0 right-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent z-10 flex justify-between items-end">
                      <span className="text-white font-bold text-lg drop-shadow-md">
                        {cat.name}
                      </span>
                      {activeCategory === cat._id && (
                        <FaCheckCircle className="text-white text-xl animate-bounce" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
          <div className="w-1.5 h-8 bg-primary rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary flex items-center gap-2">
            {!keyword && activeCategory ? (
              <>
                منتجات قسم:{" "}
                <span className="text-primary">
                  {categories.find((c) => c._id === activeCategory)?.name}
                </span>
              </>
            ) : keyword ? (
              `نتائج البحث عن: "${keyword}"`
            ) : (
              <>
                <FaFire className="text-orange-500" /> أحدث المنتجات المضافة
              </>
            )}
          </h1>
        </div>

        <div className="min-h-[300px]">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ProductSkeleton cards={8} />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-200 text-center animate-fadeIn shadow-sm">
              <div className="w-48 h-48 md:w-64 md:h-64">
                <Lottie animationData={emptyAnim} loop={true} />
              </div>
              <h3 className="text-secondary text-2xl font-bold mt-4">
                لا توجد منتجات هنا
              </h3>
              <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
                يبدو أن هذا القسم فارغ حالياً...
              </p>
              <button
                onClick={() => setActiveCategory("")}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
              >
                العودة لكل المنتجات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
              {products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
