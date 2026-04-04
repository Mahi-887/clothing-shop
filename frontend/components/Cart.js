import Link from 'next/link';
import { FiX, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FiShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items to get started!</p>
        <Link href="/products" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cartItems.map((item) => (
        <div key={item.cartId} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <Link href={`/product/${item._id}`}>
              <h3 className="font-semibold text-gray-800 hover:text-pink-600 truncate">{item.name}</h3>
            </Link>
            <div className="flex gap-3 text-sm text-gray-500 mt-1">
              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
              {item.selectedColor && <span>Color: {item.selectedColor}</span>}
            </div>
            <p className="text-pink-600 font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
            >
              <FiMinus size={12} />
            </button>
            <span className="w-6 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
            >
              <FiPlus size={12} />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeFromCart(item.cartId)}
            className="text-gray-400 hover:text-red-500 ml-2"
          >
            <FiX size={18} />
          </button>
        </div>
      ))}

      {/* Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Shipping</span>
          <span>{cartTotal >= 100 ? 'Free' : '$10.00'}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-4">
          <span>Tax (8%)</span>
          <span>${(cartTotal * 0.08).toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-3">
          <span>Total</span>
          <span className="text-pink-600">
            ${(cartTotal + (cartTotal >= 100 ? 0 : 10) + cartTotal * 0.08).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
