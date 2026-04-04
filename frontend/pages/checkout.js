import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

const steps = ['Shipping', 'Review', 'Payment'];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState(null);
  const [placing, setPlacing] = useState(false);
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-xl mb-4">Please login to checkout</p>
        <Link href="/login?redirect=checkout" className="btn-primary">Login</Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <p className="text-xl mb-4">Your cart is empty</p>
        <Link href="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  const shipping = cartTotal >= 100 ? 0 : 10;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const onShippingSubmit = (data) => {
    setShippingData(data);
    setStep(1);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.images?.[0] || '',
        price: item.price,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
      }));

      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: shippingData,
        paymentMethod: 'stripe',
      });

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i < step ? 'bg-green-500 text-white' :
              i === step ? 'bg-pink-600 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${i === step ? 'text-pink-600' : 'text-gray-500'}`}>{s}</span>
            {i < steps.length - 1 && <div className="mx-4 h-0.5 w-12 bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <form onSubmit={handleSubmit(onShippingSubmit)} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-5">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address *</label>
                  <input
                    {...register('street', { required: 'Street is required' })}
                    className="input-field"
                    placeholder="123 Main St"
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      className="input-field"
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State *</label>
                    <input
                      {...register('state', { required: 'State is required' })}
                      className="input-field"
                      placeholder="NY"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                    <input
                      {...register('zipCode', { required: 'ZIP code is required' })}
                      className="input-field"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      {...register('country')}
                      defaultValue="US"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-primary mt-6 w-full py-3">
                Continue to Review
              </button>
            </form>
          )}

          {/* Step 1: Review */}
          {step === 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-5">Order Review</h2>
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">👕</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedColor && ` | Color: ${item.selectedColor}`}
                        {` | Qty: ${item.quantity}`}
                      </p>
                    </div>
                    <p className="font-semibold text-pink-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <h3 className="font-semibold mb-2">Shipping to:</h3>
                <p className="text-gray-600 text-sm">
                  {shippingData?.street}, {shippingData?.city}, {shippingData?.state} {shippingData?.zipCode}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">
                  Back
                </button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-5">Payment</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-700 text-sm">
                  🔒 This is a demo checkout. No real payment will be processed.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="input-field"
                    readOnly
                    defaultValue="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="input-field"
                      readOnly
                      defaultValue="12/27"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="input-field"
                      readOnly
                      defaultValue="123"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  Back
                </button>
                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="btn-primary flex-1 py-3 disabled:opacity-50"
                >
                  {placing ? 'Placing Order...' : `Place Order ($${total.toFixed(2)})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-5 shadow-sm sticky top-24">
            <h3 className="font-bold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-pink-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
