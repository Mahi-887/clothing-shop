require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/clothing_shop');
  console.log('MongoDB connected for seeding');
};

const products = [
  {
    name: 'Classic White Tee',
    description: 'A timeless classic white t-shirt made from 100% premium cotton. Perfect for everyday wear.',
    price: 15,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    sizes: [
      { size: 'XS', stock: 20 }, { size: 'S', stock: 30 }, { size: 'M', stock: 50 },
      { size: 'L', stock: 40 }, { size: 'XL', stock: 25 }, { size: 'XXL', stock: 15 },
    ],
    colors: ['White', 'Black', 'Gray'],
    brand: 'BasicWear',
    isFeatured: true,
    tags: ['casual', 'basic', 'cotton'],
  },
  {
    name: 'Graphic Print Tee',
    description: 'Express yourself with this eye-catching graphic print t-shirt. Soft fabric with vibrant print.',
    price: 20,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'],
    sizes: [
      { size: 'XS', stock: 15 }, { size: 'S', stock: 25 }, { size: 'M', stock: 40 },
      { size: 'L', stock: 35 }, { size: 'XL', stock: 20 }, { size: 'XXL', stock: 10 },
    ],
    colors: ['Black', 'Navy', 'Red'],
    brand: 'StylePrint',
    isFeatured: false,
    tags: ['graphic', 'casual', 'trendy'],
  },
  {
    name: 'Premium Cotton Tee',
    description: 'Luxuriously soft premium cotton t-shirt with a relaxed fit. A wardrobe staple.',
    price: 25,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500'],
    sizes: [
      { size: 'S', stock: 30 }, { size: 'M', stock: 45 }, { size: 'L', stock: 40 },
      { size: 'XL', stock: 20 }, { size: 'XXL', stock: 10 },
    ],
    colors: ['White', 'Beige', 'Olive'],
    brand: 'LuxBasics',
    isFeatured: true,
    tags: ['premium', 'soft', 'cotton'],
  },
  {
    name: 'Casual Button-Up Shirt',
    description: 'Versatile casual button-up shirt. Great for both casual and smart-casual looks.',
    price: 35,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
    sizes: [
      { size: 'S', stock: 25 }, { size: 'M', stock: 40 }, { size: 'L', stock: 35 },
      { size: 'XL', stock: 20 }, { size: 'XXL', stock: 10 },
    ],
    colors: ['Light Blue', 'White', 'Pink'],
    brand: 'CasualStyle',
    isFeatured: true,
    tags: ['casual', 'shirt', 'button-up'],
  },
  {
    name: 'Oxford Shirt',
    description: 'Classic Oxford cloth button-down shirt. The perfect blend of style and comfort.',
    price: 45,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=500'],
    sizes: [
      { size: 'S', stock: 20 }, { size: 'M', stock: 35 }, { size: 'L', stock: 30 },
      { size: 'XL', stock: 15 }, { size: 'XXL', stock: 8 },
    ],
    colors: ['White', 'Navy', 'Plaid'],
    brand: 'ClassicWear',
    isFeatured: false,
    tags: ['oxford', 'smart-casual', 'shirt'],
  },
  {
    name: 'Formal Dress Shirt',
    description: 'Crisp and professional formal dress shirt. Perfect for the office or special occasions.',
    price: 65,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500'],
    sizes: [
      { size: 'S', stock: 15 }, { size: 'M', stock: 30 }, { size: 'L', stock: 25 },
      { size: 'XL', stock: 12 }, { size: 'XXL', stock: 6 },
    ],
    colors: ['White', 'Light Blue', 'Pale Pink'],
    brand: 'FormalWear',
    isFeatured: false,
    tags: ['formal', 'office', 'dress shirt'],
  },
  {
    name: 'Classic Blue Jeans',
    description: 'Iconic blue denim jeans with a straight cut. Durable and stylish for any occasion.',
    price: 50,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    sizes: [
      { size: 'XS', stock: 10 }, { size: 'S', stock: 25 }, { size: 'M', stock: 50 },
      { size: 'L', stock: 45 }, { size: 'XL', stock: 30 }, { size: 'XXL', stock: 15 },
    ],
    colors: ['Blue', 'Dark Blue', 'Black'],
    brand: 'DenimCo',
    isFeatured: true,
    tags: ['jeans', 'denim', 'casual'],
  },
  {
    name: 'Chino Pants',
    description: 'Versatile chino pants that work for casual and smart-casual occasions.',
    price: 40,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'],
    sizes: [
      { size: 'S', stock: 20 }, { size: 'M', stock: 40 }, { size: 'L', stock: 35 },
      { size: 'XL', stock: 20 }, { size: 'XXL', stock: 10 },
    ],
    colors: ['Khaki', 'Olive', 'Navy'],
    brand: 'CasualStyle',
    isFeatured: false,
    tags: ['chinos', 'smart-casual', 'pants'],
  },
  {
    name: 'Comfortable Joggers',
    description: 'Ultra-comfortable jogger pants with an elastic waistband. Perfect for workouts and lounging.',
    price: 35,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=500'],
    sizes: [
      { size: 'XS', stock: 15 }, { size: 'S', stock: 25 }, { size: 'M', stock: 45 },
      { size: 'L', stock: 40 }, { size: 'XL', stock: 25 }, { size: 'XXL', stock: 12 },
    ],
    colors: ['Gray', 'Black', 'Navy'],
    brand: 'ActiveWear',
    isFeatured: false,
    tags: ['joggers', 'activewear', 'comfortable'],
  },
  {
    name: 'Formal Trousers',
    description: 'Elegant formal trousers with a slim fit. Essential for professional settings.',
    price: 70,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500'],
    sizes: [
      { size: 'S', stock: 15 }, { size: 'M', stock: 30 }, { size: 'L', stock: 25 },
      { size: 'XL', stock: 15 }, { size: 'XXL', stock: 8 },
    ],
    colors: ['Black', 'Charcoal', 'Navy'],
    brand: 'FormalWear',
    isFeatured: false,
    tags: ['formal', 'trousers', 'office'],
  },
  {
    name: 'Casual Day Dress',
    description: 'Light and breezy casual day dress. Perfect for warm days and casual outings.',
    price: 60,
    category: 'dresses',
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500'],
    sizes: [
      { size: 'XS', stock: 20 }, { size: 'S', stock: 30 }, { size: 'M', stock: 40 },
      { size: 'L', stock: 25 }, { size: 'XL', stock: 15 },
    ],
    colors: ['Floral', 'Yellow', 'White'],
    brand: 'SummerVibes',
    isFeatured: true,
    tags: ['casual', 'summer', 'dress'],
  },
  {
    name: 'Elegant Maxi Dress',
    description: 'Flowing maxi dress with an elegant silhouette. Perfect for special occasions.',
    price: 85,
    category: 'dresses',
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500'],
    sizes: [
      { size: 'XS', stock: 12 }, { size: 'S', stock: 20 }, { size: 'M', stock: 30 },
      { size: 'L', stock: 20 }, { size: 'XL', stock: 10 },
    ],
    colors: ['Navy', 'Burgundy', 'Forest Green'],
    brand: 'ElegantStyle',
    isFeatured: true,
    tags: ['maxi', 'elegant', 'special occasion'],
  },
  {
    name: 'Party Dress',
    description: 'Stunning party dress that will make you the center of attention. Sequined and sophisticated.',
    price: 120,
    category: 'dresses',
    images: ['https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=500'],
    sizes: [
      { size: 'XS', stock: 10 }, { size: 'S', stock: 15 }, { size: 'M', stock: 20 },
      { size: 'L', stock: 12 }, { size: 'XL', stock: 8 },
    ],
    colors: ['Black', 'Gold', 'Silver'],
    brand: 'GlamWear',
    isFeatured: true,
    tags: ['party', 'sequin', 'glamour'],
  },
  {
    name: 'Midi Dress',
    description: 'Versatile midi dress suitable for work and casual wear. A wardrobe essential.',
    price: 75,
    category: 'dresses',
    images: ['https://images.unsplash.com/photo-1558171813-1ff18e6e6a1c?w=500'],
    sizes: [
      { size: 'XS', stock: 15 }, { size: 'S', stock: 25 }, { size: 'M', stock: 35 },
      { size: 'L', stock: 25 }, { size: 'XL', stock: 12 },
    ],
    colors: ['Black', 'Burgundy', 'Camel'],
    brand: 'ClassicWear',
    isFeatured: false,
    tags: ['midi', 'versatile', 'work'],
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Iconic denim jacket that never goes out of style. Perfect layering piece for all seasons.',
    price: 90,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=500'],
    sizes: [
      { size: 'XS', stock: 15 }, { size: 'S', stock: 25 }, { size: 'M', stock: 40 },
      { size: 'L', stock: 35 }, { size: 'XL', stock: 20 }, { size: 'XXL', stock: 10 },
    ],
    colors: ['Light Blue', 'Dark Blue', 'Black'],
    brand: 'DenimCo',
    isFeatured: true,
    tags: ['denim', 'jacket', 'casual'],
  },
  {
    name: 'Premium Leather Jacket',
    description: 'Luxurious genuine leather jacket. Timeless style that only gets better with age.',
    price: 150,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    sizes: [
      { size: 'S', stock: 15 }, { size: 'M', stock: 25 }, { size: 'L', stock: 20 },
      { size: 'XL', stock: 12 }, { size: 'XXL', stock: 6 },
    ],
    colors: ['Black', 'Brown', 'Tan'],
    brand: 'LeatherCraft',
    isFeatured: true,
    tags: ['leather', 'premium', 'jacket'],
  },
  {
    name: 'Windbreaker Jacket',
    description: 'Lightweight windbreaker perfect for outdoor activities. Water-resistant and packable.',
    price: 70,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1544923246-77307dd654cb?w=500'],
    sizes: [
      { size: 'XS', stock: 20 }, { size: 'S', stock: 30 }, { size: 'M', stock: 45 },
      { size: 'L', stock: 40 }, { size: 'XL', stock: 25 }, { size: 'XXL', stock: 12 },
    ],
    colors: ['Blue', 'Red', 'Black', 'Green'],
    brand: 'OutdoorGear',
    isFeatured: false,
    tags: ['windbreaker', 'outdoor', 'lightweight'],
  },
  {
    name: 'Smart Blazer',
    description: 'Sharp and professional blazer. Perfect for business meetings or smart-casual events.',
    price: 110,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500'],
    sizes: [
      { size: 'XS', stock: 10 }, { size: 'S', stock: 20 }, { size: 'M', stock: 35 },
      { size: 'L', stock: 30 }, { size: 'XL', stock: 18 }, { size: 'XXL', stock: 8 },
    ],
    colors: ['Navy', 'Charcoal', 'Black'],
    brand: 'FormalWear',
    isFeatured: true,
    tags: ['blazer', 'formal', 'smart'],
  },
  {
    name: 'Striped Long Sleeve Shirt',
    description: 'Classic striped long sleeve shirt. A must-have for any wardrobe.',
    price: 30,
    category: 'shirts',
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500'],
    sizes: [
      { size: 'S', stock: 25 }, { size: 'M', stock: 40 }, { size: 'L', stock: 35 },
      { size: 'XL', stock: 20 }, { size: 'XXL', stock: 10 },
    ],
    colors: ['Blue/White', 'Red/White', 'Navy/White'],
    brand: 'CasualStyle',
    isFeatured: false,
    tags: ['striped', 'long sleeve', 'classic'],
  },
  {
    name: 'Floral Summer Dress',
    description: 'Beautiful floral print summer dress. Light and comfortable for hot days.',
    price: 55,
    category: 'dresses',
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500'],
    sizes: [
      { size: 'XS', stock: 18 }, { size: 'S', stock: 28 }, { size: 'M', stock: 38 },
      { size: 'L', stock: 22 }, { size: 'XL', stock: 12 },
    ],
    colors: ['Floral Pink', 'Floral Blue', 'Floral Yellow'],
    brand: 'SummerVibes',
    isFeatured: false,
    tags: ['floral', 'summer', 'feminine'],
  },
  {
    name: 'Slim Fit Black Jeans',
    description: 'Sleek slim fit black jeans that transition effortlessly from day to night.',
    price: 55,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=500'],
    sizes: [
      { size: 'XS', stock: 12 }, { size: 'S', stock: 22 }, { size: 'M', stock: 45 },
      { size: 'L', stock: 40 }, { size: 'XL', stock: 28 }, { size: 'XXL', stock: 14 },
    ],
    colors: ['Black'],
    brand: 'DenimCo',
    isFeatured: false,
    tags: ['slim fit', 'black', 'jeans'],
  },
  {
    name: 'Oversized Hoodie',
    description: 'Super cozy oversized hoodie. Perfect for lounging or casual outings.',
    price: 45,
    category: 'jackets',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500'],
    sizes: [
      { size: 'XS', stock: 20 }, { size: 'S', stock: 30 }, { size: 'M', stock: 50 },
      { size: 'L', stock: 45 }, { size: 'XL', stock: 30 }, { size: 'XXL', stock: 15 },
    ],
    colors: ['Gray', 'Black', 'Pink', 'Sage'],
    brand: 'ComfyWear',
    isFeatured: true,
    tags: ['hoodie', 'oversized', 'cozy'],
  },
  {
    name: 'Vintage Band Tee',
    description: 'Retro-style vintage band tee with a worn-in look. Great for music lovers.',
    price: 22,
    category: 't-shirts',
    images: ['https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500'],
    sizes: [
      { size: 'XS', stock: 15 }, { size: 'S', stock: 25 }, { size: 'M', stock: 40 },
      { size: 'L', stock: 35 }, { size: 'XL', stock: 20 }, { size: 'XXL', stock: 10 },
    ],
    colors: ['Black', 'White', 'Washed Gray'],
    brand: 'RetroStyle',
    isFeatured: false,
    tags: ['vintage', 'band', 'retro'],
  },
  {
    name: 'Linen Trousers',
    description: 'Breathable linen trousers perfect for warm weather. Relaxed fit with a tailored look.',
    price: 60,
    category: 'pants',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500'],
    sizes: [
      { size: 'S', stock: 18 }, { size: 'M', stock: 32 }, { size: 'L', stock: 28 },
      { size: 'XL', stock: 15 }, { size: 'XXL', stock: 8 },
    ],
    colors: ['White', 'Beige', 'Light Blue'],
    brand: 'SummerStyle',
    isFeatured: false,
    tags: ['linen', 'summer', 'breathable'],
  },
  {
    name: 'Wrap Midi Dress',
    description: 'Flattering wrap midi dress that suits all body types. Elegant and effortless.',
    price: 80,
    category: 'dresses',
    images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500'],
    sizes: [
      { size: 'XS', stock: 14 }, { size: 'S', stock: 24 }, { size: 'M', stock: 34 },
      { size: 'L', stock: 24 }, { size: 'XL', stock: 12 },
    ],
    colors: ['Emerald', 'Rust', 'Purple'],
    brand: 'ElegantStyle',
    isFeatured: true,
    tags: ['wrap dress', 'midi', 'flattering'],
  },
];

const seed = async () => {
  try {
    await connectDB();

    // Dynamic import of models
    const Product = mongoose.model('Product') || require('../backend/models/Product');

    await mongoose.connection.db.dropCollection('products').catch(() => {});
    console.log('Cleared products collection');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
