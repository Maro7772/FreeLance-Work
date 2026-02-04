import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setKeyword("");
    }
  }, [location]);

  const searchHandler = (val) => {
    setKeyword(val);
    if (val.trim()) {
      navigate(`/search/${val}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="relative w-full group">
      <div className="flex items-center bg-gray-700/50 border border-gray-600 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-primary focus-within:bg-gray-700 focus-within:shadow-lg focus-within:shadow-primary/20">
        <input
          type="text"
          name="q"
          value={keyword}
          onChange={(e) => searchHandler(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="bg-transparent text-white flex-1 px-4 py-2.5 focus:outline-none w-full placeholder-gray-400 font-normal"
          autoComplete="off"
        />

        <button
          type="button"
          className={`p-3 transition-colors duration-300 ${
            keyword ? "text-primary" : "text-gray-400"
          }`}
        >
          <FaSearch className={keyword ? "scale-110" : "scale-100"} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
