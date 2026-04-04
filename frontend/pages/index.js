import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import api from '../lib/api';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiPhone } from 'react-icons/fi';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?featured=true&limit=8');
        setFeaturedProducts(data.products);
      } catch {
        // fallback silently
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'T-Shirts', slug: 't-shirts', emoji: '👕', color: 'bg-pink-100' },
    { name: 'Shirts', slug: 'shirts', emoji: '👔', color: 'bg-blue-100' },
    { name: 'Pants', slug: 'pants', emoji: '👖', color: 'bg-green-100' },
    { name: 'Dresses', slug: 'dresses', emoji: '👗', color: 'bg-purple-100' },
    { name: 'Jackets', slug: 'jackets', emoji: '🧥', color: 'bg-orange-100' },
  ];

  const features = [
    { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: FiPhone, title: '24/7 Support', desc: 'Always here to help' },
  ];

  const testimonials = [
    { name: 'Sarah M.', text: 'Amazing quality! The clothes fit perfectly and the shipping was super fast.', rating: 5 },
    { name: 'John D.', text: 'Best online clothing store I\'ve used. Great variety and excellent prices.', rating: 5 },
    { name: 'Emily K.', text: 'Love the new dress I ordered. It looked exactly like the photos!', rating: 4 },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Dress to<br />
                <span className="text-pink-600">Impress</span> 🌟
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-md">
                Discover the latest trends in fashion. Quality clothing for every occasion, delivered to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/products" className="btn-primary text-center text-lg py-3 px-8">
                  Shop Now
                </Link>
                <Link href="/products?featured=true" className="btn-outline text-center text-lg py-3 px-8">
                  View Featured
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="text-9xl animate-bounce">👗</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="text-pink-600" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`${cat.color} rounded-2xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer group`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                <p className="font-semibold text-gray-800">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link href="/products?featured=true" className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden">
                  <div className="skeleton aspect-square" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 rounded w-3/4" />
                    <div className="skeleton h-4 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Summer Sale — Up to 40% Off!</h2>
          <p className="text-xl opacity-90 mb-8">Limited time offer on selected items</p>
          <Link href="/products" className="bg-white text-pink-600 font-bold py-3 px-8 rounded-full hover:bg-pink-50 transition-colors">
            Shop the Sale
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{t.text}"</p>
                <p className="font-semibold text-gray-800">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
