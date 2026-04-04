import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { FiArrowLeft, FiTruck, FiPackage, FiCheck, FiClock, FiX } from 'react-icons/fi';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
const statusConfig = {
  pending: { icon: FiClock, color: 'text-yellow-500', label: 'Pending' },
  processing: { icon: FiPackage, color: 'text-blue-500', label: 'Processing' },
  shipped: { icon: FiTruck, color: 'text-purple-500', label: 'Shipped' },
  delivered: { icon: FiCheck, color: 'text-green-500', label: 'Delivered' },
  cancelled: { icon: FiX, color: 'text-red-500', label: 'Cancelled' },
};

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.order);
      } catch {
        router.push('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [user, id]);

  if (loading || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/orders" className="flex items-center gap-2 text-gray-500 hover:text-pink-600 mb-6">
        <FiArrowLeft /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
          isCancelled ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <StatusIcon size={16} className={status.color} />
          <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>

      {/* Progress Tracker */}
      {!isCancelled && (
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => {
              const stepStatus = statusConfig[step];
              const StepIcon = stepStatus.icon;
              const isCompleted = i <= currentStatusIndex;
              const isActive = i === currentStatusIndex;

              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <StepIcon size={16} />
                    </div>
                    <p className={`text-xs mt-1 ${isActive ? 'text-pink-600 font-semibold' : 'text-gray-500'}`}>
                      {stepStatus.label}
                    </p>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={`h-0.5 flex-1 -mt-5 ${i < currentStatusIndex ? 'bg-pink-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
        <h2 className="font-bold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.orderItems?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.size && `Size: ${item.size}`}
                  {item.color && ` | ${item.color}`}
                  {` | Qty: ${item.quantity}`}
                </p>
              </div>
              <p className="font-semibold text-pink-600">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span><span>${order.itemsPrice?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span><span>${order.taxPrice?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total</span><span className="text-pink-600">${order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
          <h2 className="font-bold mb-3">Shipping Address</h2>
          <p className="text-gray-600">
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
      )}

      {/* Payment Info */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h2 className="font-bold mb-3">Payment</h2>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 capitalize">{order.paymentMethod}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
          </span>
        </div>
        {order.trackingNumber && (
          <p className="text-sm text-gray-500 mt-2">Tracking: {order.trackingNumber}</p>
        )}
      </div>
    </div>
  );
}
