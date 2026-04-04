import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { FiPackage, FiUsers, FiDollarSign, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/admin/analytics');
        setAnalytics(data.analytics);
      } catch {
        // error handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  if (!user || user.role !== 'admin') return null;

  const stats = analytics
    ? [
        { label: 'Total Orders', value: analytics.totalOrders, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600' },
        { label: 'Total Revenue', value: `$${analytics.totalRevenue?.toFixed(2)}`, icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
        { label: 'Total Users', value: analytics.totalUsers, icon: FiUsers, color: 'bg-purple-50 text-purple-600' },
        { label: 'Total Products', value: analytics.totalProducts, icon: FiPackage, color: 'bg-pink-50 text-pink-600' },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/products" className="btn-outline text-sm">Manage Products</Link>
          <Link href="/admin/orders" className="btn-primary text-sm">Manage Orders</Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-xl" />)}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Recent Orders</h2>
                <Link href="/admin/orders" className="text-pink-600 text-sm flex items-center gap-1 hover:underline">
                  View all <FiArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {analytics?.recentOrders?.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{order.user?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-pink-600">${order.totalPrice?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Top Products</h2>
                <Link href="/admin/products" className="text-pink-600 text-sm flex items-center gap-1 hover:underline">
                  View all <FiArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {analytics?.topProducts?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium truncate max-w-36">{item.product?.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{item.totalSold} sold</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
