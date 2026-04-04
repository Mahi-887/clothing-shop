const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['t-shirts', 'shirts', 'pants', 'dresses', 'jackets', 'accessories'],
    },
    images: [{ type: String }],
    sizes: [
      {
        size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
        stock: { type: Number, default: 0 },
      },
    ],
    colors: [{ type: String }],
    brand: { type: String, default: 'Generic' },
    tags: [{ type: String }],
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    totalStock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    sku: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.pre('save', function (next) {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((acc, s) => acc + (s.stock || 0), 0);
  }
  if (this.reviews && this.reviews.length > 0) {
    this.numReviews = this.reviews.length;
    this.rating =
      this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
