import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX } from 'react-icons/fi';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=profile');
      return;
    }
    setFormData({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', formData);
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">{user.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Info */}
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary flex items-center gap-2">
                <FiX /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <FiUser className="text-pink-600" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FiMail className="text-pink-600" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 text-gray-600">
                <FiPhone className="text-pink-600" />
                <span>{user.phone}</span>
              </div>
            )}
            <button
              onClick={() => setEditing(true)}
              className="btn-outline flex items-center gap-2 mt-4"
            >
              <FiEdit2 /> Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/orders', label: '📦 My Orders', desc: 'Track your orders' },
          { href: '/wishlist', label: '❤️ Wishlist', desc: 'Saved items' },
          { href: '/products', label: '🛍️ Shop', desc: 'Browse products' },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <p className="text-lg font-semibold mb-1">{link.label}</p>
            <p className="text-sm text-gray-500">{link.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
