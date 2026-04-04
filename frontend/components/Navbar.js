import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart } from 'react-icons/fi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const categories = [
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Shirts', value: 'shirts' },
    { label: 'Pants', value: 'pants' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Jackets', value: 'jackets' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-pink-600">👗 FashionHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/products?category=${cat.value}`}
                className="text-gray-600 hover:text-pink-600 font-medium transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-48"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-pink-600">
                <FiSearch size={16} />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {user && (
              <Link href="/wishlist" className="text-gray-600 hover:text-pink-600 hidden md:block">
                <FiHeart size={22} />
              </Link>
            )}

            <Link href="/cart" className="relative text-gray-600 hover:text-pink-600">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-pink-600">
                  <FiUser size={22} />
                  <span className="hidden md:block text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-pink-50 hover:text-pink-600">Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-pink-50 hover:text-pink-600">My Orders</Link>
                  <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-pink-50 hover:text-pink-600">Wishlist</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-pink-50 hover:text-pink-600">Admin</Link>
                  )}
                  <hr className="my-1" />
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm hover:bg-pink-50 hover:text-pink-600">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-gray-600 hover:text-pink-600">
                <FiUser size={22} />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-pink-600"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                  <FiSearch size={16} />
                </button>
              </div>
            </form>
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/products?category=${cat.value}`}
                className="block py-2 text-gray-600 hover:text-pink-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
