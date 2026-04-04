import Link from 'next/link';
import Cart from '../components/Cart';
import { useCart } from '../context/CartContext';
import { FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { cartItems, cartTotal } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Cart />
        </div>

        {cartItems.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={cartTotal >= 100 ? 'text-green-600' : ''}>
                    {cartTotal >= 100 ? 'Free' : '$10.00'}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
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

              <Link href="/checkout" className="btn-primary w-full text-center block py-3">
                Proceed to Checkout
              </Link>
              <Link href="/products" className="btn-secondary w-full text-center block py-3 mt-3">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
