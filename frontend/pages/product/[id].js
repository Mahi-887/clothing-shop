import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import api from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiHeart, FiShoppingCart, FiStar, FiArrowLeft, FiTruck } from 'react-icons/fi';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setSelectedColor(data.product.colors?.[0] || '');
      } catch {
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      await api.post(`/users/wishlist/${product._id}`);
      toast.success('Added to wishlist!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewText,
      });
      toast.success('Review submitted!');
      setReviewText('');
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-6 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  const availableStock = product.sizes?.find((s) => s.size === selectedSize)?.stock || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="flex items-center gap-2 text-gray-500 hover:text-pink-600 mb-6">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">👕</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-pink-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2 capitalize">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={18}
                    className={i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-500">({product.numReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            {discountedPrice ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-pink-600">${discountedPrice.toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through">${product.price}</span>
                <span className="bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded">-{product.discount}%</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-pink-600">${product.price}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Color Selection */}
          {product.colors?.length > 0 && (
            <div className="mb-5">
              <p className="font-semibold mb-2">Color: <span className="text-pink-600">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                      selectedColor === color
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'border-gray-300 hover:border-pink-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="font-semibold mb-2">Size: <span className="text-pink-600">{selectedSize || 'Select a size'}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(({ size, stock }) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={stock === 0}
                    className={`w-12 h-12 rounded-lg border font-medium text-sm transition-colors ${
                      selectedSize === size
                        ? 'bg-pink-600 text-white border-pink-600'
                        : stock === 0
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'border-gray-300 hover:border-pink-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && availableStock > 0 && availableStock <= 5 && (
                <p className="text-orange-500 text-sm mt-1">Only {availableStock} left!</p>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.totalStock === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={handleWishlist}
              className="p-3 border-2 border-pink-600 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <FiHeart size={20} />
            </button>
          </div>

          {/* Shipping info */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
            <FiTruck size={16} />
            <span>Free shipping on orders over $100</span>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Reviews</h2>

        {product.reviews?.length > 0 ? (
          <div className="grid gap-4 mb-8">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{review.name}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        size={14}
                        className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No reviews yet. Be the first to review!</p>
        )}

        {/* Add Review Form */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Write a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                required
                placeholder="Share your experience..."
                className="input-field resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="btn-primary disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
