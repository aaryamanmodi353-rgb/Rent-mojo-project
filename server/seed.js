const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const sampleProducts = [
  {
    name: 'Comfort Grey Sofa',
    category: 'Furniture',
    subCategory: 'Sofa',
    description: 'A premium 3-seater fabric sofa, perfect for your living room. Soft cushioning and durable frame.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    monthlyRent: 1200,
    securityDeposit: 3000,
    tenureOptions: [3, 6, 12],
    stock: 5,
    isAvailable: true
  },
  {
    name: 'Queen Size Bed (Teak)',
    category: 'Furniture',
    subCategory: 'Bed',
    description: 'Solid teak wood queen size bed with storage. Mattress not included.',
    image: 'https://images.unsplash.com/photo-1505693416388-b0346efee539?auto=format&fit=crop&w=800&q=80',
    monthlyRent: 900,
    securityDeposit: 2500,
    tenureOptions: [6, 12],
    stock: 3,
    isAvailable: true
  },
  {
    name: 'Smart LED TV (43 inch)',
    category: 'Appliances',
    subCategory: 'TV',
    description: 'Full HD Smart LED TV with Netflix and YouTube support. Wall mount included.',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    monthlyRent: 850,
    securityDeposit: 2000,
    tenureOptions: [3, 6, 12],
    stock: 10,
    isAvailable: true
  },
  {
    name: 'Top Load Washing Machine',
    category: 'Appliances',
    subCategory: 'Washing Machine',
    description: 'Fully automatic top load washing machine. 6.5kg capacity, suitable for bachelors and couples.',
    image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=800&q=80',
    monthlyRent: 700,
    securityDeposit: 1500,
    tenureOptions: [3, 6, 12],
    stock: 4,
    isAvailable: true
  },
  {
    name: 'Study Table & Chair',
    category: 'Furniture',
    subCategory: 'Table',
    description: 'Ergonomic wooden study table with a comfortable office chair. Ideal for work from home.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    monthlyRent: 450,
    securityDeposit: 1000,
    tenureOptions: [3, 6],
    stock: 8,
    isAvailable: true
  },
  {
    name: 'Double Door Refrigerator',
    category: 'Appliances',
    subCategory: 'Fridge',
    description: '260L Frost Free Double Door Refrigerator. Energy efficient and spacious.',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80',
    monthlyRent: 1500,
    securityDeposit: 4000,
    tenureOptions: [6, 12],
    stock: 2,
    isAvailable: true
  }
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing in .env");

    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔌 Connected to MongoDB Atlas...');

    // 1. REFRESH CATALOG: Wiping products is fine for development
    await Product.deleteMany({});
    console.log('🗑️  Product catalog cleared.');

    // 2. SEED PRODUCTS
    await Product.insertMany(sampleProducts);
    console.log('✅ 6 Products seeded successfully!');

    // 3. SMART USER SEEDING: Checks if admin exists before acting
    const adminEmail = "admin@rentmojo.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const admin = new User({
        name: "Aaryaman Admin",
        email: adminEmail,
        password: "adminpassword123", // Plain text; Model pre-save hook handles hashing
        phone: "6264386892",
        address: "VIT Campus, Vellore",
        role: 'admin'
      });
      
      await admin.save();
      console.log('👑 Admin Created for the first time: admin@rentmojo.com');
    } else {
      console.log('ℹ️  Admin already exists. User database remains untouched.');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error Seeding:', err.message);
    process.exit(1);
  }
};

seedDB();