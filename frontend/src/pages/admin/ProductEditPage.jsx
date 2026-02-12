import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../apis/axios";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  FaCheckCircle,
  FaTrash,
  FaImage,
  FaUpload,
  FaBoxOpen,
  FaDollarSign,
  FaLayerGroup,
  FaSortNumericUp,
  FaLink,
  FaPen,
  FaEdit
} from "react-icons/fa";

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [tempImage, setTempImage] = useState("");
  const [images, setImages] = useState([]);
  const [imageCover, setImageCover] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: cats } = await axios.get("/api/categories");
        setCategories(cats);

        const { data: product } = await axios.get(`/api/products/${productId}`);
        setName(product.name);
        setPrice(product.price);
        setCategory(product.category?._id || product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setImageCover(product.imageCover);

        if (product.images && product.images.length > 0) {
          setImages(product.images);
        } else if (product.imageCover) {
          setImages([product.imageCover]);
        } else {
          setImages([]);
        }
        setLoading(false);
      } catch (error) {
        toast.error("فشل تحميل البيانات");
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const addImageHandler = (e) => {
    e.preventDefault();
    if (!tempImage) return;
    addImagesToState(tempImage);
    setTempImage("");
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post("/api/upload", formData, config);
      addImagesToState(data);
      setUploading(false);
      toast.success("تم رفع الصورة 📸");
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error("فشل رفع الصورة");
    }
  };

  const addImagesToState = (imgUrl) => {
    const newImages = [...images, imgUrl];
    setImages(newImages);
    if (!imageCover) setImageCover(imgUrl);
  };

  const removeImageHandler = (imgToRemove) => {
    const newImages = images.filter((img) => img !== imgToRemove);
    setImages(newImages);
    if (imgToRemove === imageCover) {
      setImageCover(newImages.length > 0 ? newImages[0] : "");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/products/${productId}`,
        {
          name,
          price,
          description,
          category,
          countInStock,
          images,
          imageCover
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("تم تحديث المنتج بنجاح ✅");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل التحديث");
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-2xl font-bold text-gray-500 font-cairo">
        جاري تحميل البيانات...
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl font-cairo">
      <Breadcrumbs
        pages={[{ name: "لوحة التحكم", url: "/admin/dashboard" }]}
        currentPage={`تعديل: ${name}`}
      />

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-8 text-secondary flex items-center gap-2 border-b border-gray-100 pb-4">
          <FaEdit className="text-primary" /> تعديل بيانات المنتج
        </h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                اسم المنتج
              </label>
              <div className="relative">
                <FaPen className="absolute right-3 top-4 text-gray-300" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary bg-gray-50/30 transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                السعر (ج.م)
              </label>
              <div className="relative">
                <FaDollarSign className="absolute right-3 top-4 text-gray-300" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary bg-gray-50/30 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                القسم
              </label>
              <div className="relative">
                <FaLayerGroup className="absolute right-3 top-4 text-gray-300 z-10" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary bg-gray-50/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر القسم...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                العدد المتاح
              </label>
              <div className="relative">
                <FaSortNumericUp className="absolute right-3 top-4 text-gray-300" />
                <input
                  type="number"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary bg-gray-50/30 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">
              الوصف
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-primary bg-gray-50/30 transition-all h-32 resize-none"
            ></textarea>
          </div>

          <div className="border border-dashed border-gray-300 rounded-2xl p-6 bg-gray-50/50">
            <label className="block text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <FaImage className="text-primary" /> إدارة الصور
            </label>

            <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
              <div className="relative flex-1 w-full">
                <FaLink className="absolute right-3 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={tempImage}
                  onChange={(e) => setTempImage(e.target.value)}
                  placeholder="أضف رابط صورة مباشر..."
                  className="w-full border border-gray-200 pr-10 pl-4 py-3 rounded-xl focus:outline-none focus:border-primary bg-white transition-all"
                />
              </div>
              <button
                type="button"
                onClick={addImageHandler}
                className="bg-secondary text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition font-bold shadow-sm whitespace-nowrap w-full md:w-auto"
              >
                إضافة
              </button>

              <label
                className={`bg-primary text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-green-600 transition font-bold shadow-sm flex items-center justify-center gap-2 w-full md:w-auto ${uploading ? "opacity-70 cursor-wait" : ""}`}
              >
                <FaUpload />
                <span>{uploading ? "جاري..." : "رفع صورة"}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={uploadFileHandler}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`relative border-2 rounded-xl p-2 bg-white transition-all ${imageCover === img ? "border-green-500 shadow-md ring-2 ring-green-100" : "border-gray-200 hover:border-primary/50"}`}
                >
                  <div className="h-32 w-full bg-gray-50 rounded-lg mb-2 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={img}
                      alt="preview"
                      className="w-full h-full object-contain"
                    />
                    {imageCover === img && (
                      <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                          الغلاف
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageCover(img)}
                      className={`text-xs flex-1 py-1.5 rounded-lg font-bold transition-colors ${imageCover === img ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600"}`}
                    >
                      {imageCover === img ? "تم" : "تعيين"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImageHandler(img)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {images.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-4">
                لا توجد صور، يرجى إضافة صور للمنتج.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-100 text-lg flex justify-center items-center gap-2"
          >
            حفظ التعديلات
            <FaCheckCircle />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;
