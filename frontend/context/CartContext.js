import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product, quantity = 1, size, color) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item._id === product._id && item.selectedSize === size && item.selectedColor === color
    );

    let updatedCart;
    if (existingIndex >= 0) {
      updatedCart = cartItems.map((item, i) =>
        i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        { ...product, quantity, selectedSize: size, selectedColor: color, cartId: `${product._id}-${size}-${color}-${Date.now()}` },
      ];
    }

    saveCart(updatedCart);
    toast.success('Added to cart!');
  };

  const removeFromCart = (cartId) => {
    saveCart(cartItems.filter((item) => item.cartId !== cartId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) return;
    saveCart(cartItems.map((item) => (item.cartId === cartId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
