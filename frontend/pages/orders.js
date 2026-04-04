import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';

const statusConfig = {
  pending: { icon: FiClock, color: 'text-yellow-500', bg: 'bg-yellow-50', label: 'Pending' },
  processing: { icon: FiPackage, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Processing' },
  shipped: { icon: FiTruck, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Shipped' },
  delivered: { icon: FiCheck, color: 'text-green-500', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { icon: FiX, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
};

export default function Orders() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=orders');
      return;
    }
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.orders);
      } catch {
        // error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 skeleton h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📦</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <Link href="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <Link key={order._id} href={`/orders/${order._id}`}>
                <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
                      <StatusIcon size={14} className={status.color} />
                      <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 overflow-x-auto">
                    {order.orderItems?.slice(0, 4).map((item, i) => (
                      <div key={i} className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">👕</div>
                        )}
                      </div>
                    ))}
                    {order.orderItems?.length > 4 && (
                      <span className="text-sm text-gray-500">+{order.orderItems.length - 4} more</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{order.orderItems?.length} item(s)</p>
                    <p className="font-bold text-pink-600">${order.totalPrice?.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
