import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    const defaultSize = product.sizes?.[0]?.size;
    const defaultColor = product.colors?.[0];
    addToCart(product, 1, defaultSize, defaultColor);
    setAddingToCart(false);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await api.delete(`/users/wishlist/${product._id}`);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/users/wishlist/${product._id}`);
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating wishlist');
    }
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300">
      <Link href={`/product/${product._id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
              👕
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFeatured && (
              <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full">Featured</span>
            )}
            {product.discount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">-{product.discount}%</span>
            )}
            {product.totalStock === 0 && (
              <span className="bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full">Out of Stock</span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${
              isWishlisted ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'
            }`}
          >
            <FiHeart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-800 hover:text-pink-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={12}
                  className={i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.numReviews})</span>
          </div>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1 mb-3">
            {product.colors.slice(0, 4).map((color) => (
              <span key={color} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {color}
              </span>
            ))}
          </div>
        )}

        {/* Price and Cart */}
        <div className="flex items-center justify-between">
          <div>
            {discountedPrice ? (
              <div>
                <span className="font-bold text-pink-600">${discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-400 line-through ml-2">${product.price}</span>
              </div>
            ) : (
              <span className="font-bold text-pink-600">${product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.totalStock === 0}
            className="p-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
