import { Link } from "react-router-dom";
import { FaStar, FaPlus } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Product = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden group">
      {/* قسم الصورة */}
      <Link
        to={`/product/${product._id}`}
        className="block overflow-hidden relative"
      >
        <div className="bg-gray-50 h-64 w-full flex justify-center items-center p-4">
          <img
            src={product.imageCover}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* قسم التفاصيل */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-bold text-gray-800 mb-2 truncate hover:text-primary transition-colors font-cairo">
            {product.name}
          </h2>
        </Link>

        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400 text-sm">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={
                  index < Math.round(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-200"
                }
              />
            ))}
          </div>
          <span className="text-gray-400 text-[10px] font-bold mr-2">
            ({product.numReviews} تقييم)
          </span>
        </div>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xl font-black text-secondary">
              {product.price.toLocaleString()}{" "}
              <span className="text-xs text-gray-400 font-normal italic">
                ج.م
              </span>
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-primary/10 text-primary p-3 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
            title="أضف للسلة"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
