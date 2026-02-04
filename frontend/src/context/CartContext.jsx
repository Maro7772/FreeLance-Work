import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const cartKey = userInfo ? `cartItems_${userInfo._id}` : "cartItems_guest";

  const [cartItems, setCartItems] = useState(
    localStorage.getItem(cartKey)
      ? JSON.parse(localStorage.getItem(cartKey))
      : []
  );

  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {}
  );

  const [paymentMethod, setPaymentMethod] = useState(
    localStorage.getItem("paymentMethod")
      ? JSON.parse(localStorage.getItem("paymentMethod"))
      : "CashOnDelivery"
  );

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem("paymentMethod", JSON.stringify(data));
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem("shippingAddress", JSON.stringify(data));
  };

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...product, qty: Number(qty) } : x
        )
      );
      toast.info("تم تحديث الكمية");
    } else {
      setCartItems([...cartItems, { ...product, qty: Number(qty) }]);
      toast.success("تمت الإضافة للسلة 🛒");
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
    toast.error("تم حذف المنتج");
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(cartKey);
  };

  const resetCartContext = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        shippingAddress,
        saveShippingAddress,
        paymentMethod,
        savePaymentMethod,
        resetCartContext
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
