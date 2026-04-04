import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">👗 FashionHub</h3>
            <p className="text-sm leading-relaxed">
              Your one-stop destination for trendy and affordable clothing. Quality fashion for everyone.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-pink-400 transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="hover:text-pink-400 transition-colors"><FiInstagram size={20} /></a>
              <a href="#" className="hover:text-pink-400 transition-colors"><FiTwitter size={20} /></a>
              <a href="#" className="hover:text-pink-400 transition-colors"><FiMail size={20} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              {['t-shirts', 'shirts', 'pants', 'dresses', 'jackets'].map((cat) => (
                <li key={cat}>
                  <Link href={`/products?category=${cat}`} className="hover:text-pink-400 transition-colors capitalize">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-pink-400 transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-pink-400 transition-colors">Register</Link></li>
              <li><Link href="/profile" className="hover:text-pink-400 transition-colors">Profile</Link></li>
              <li><Link href="/orders" className="hover:text-pink-400 transition-colors">Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-pink-400 transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-3">Get the latest deals and fashion updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm rounded-r-lg transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>© {new Date().getFullYear()} FashionHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
