require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Business = require('./models/Business');
const Inquiry = require('./models/Inquiry');
const Payment = require('./models/Payment');
const Product = require('./models/Product');
const Promotion = require('./models/Promotion');
const User = require('./models/User');

const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const businessSeed = [
  {
    name: 'Lagos Fresh Foods',
    category: 'Food',
    state: 'Lagos',
    address: '12 Balogun St, Lagos Island',
    phone: '08012345678',
    email: 'hello@lagosfreshfoods.test',
    description: 'Fresh farm produce, local Nigerian delicacies, food trays and doorstep delivery for families and events.',
    coverImageUrl: image('photo-1542838132-92c53300491e'),
    logoUrl: image('photo-1512621776951-a57141f2eefd'),
    products: [
      ['Fresh Tomatoes Basket', 'Medium basket of ripe tomatoes from trusted farms.', 8000, image('photo-1592924357228-91a4daadcfea')],
      ['Local Rice Pack', 'Stone-free Nigerian rice packed for homes and restaurants.', 12500, image('photo-1586201375761-83865001e31c')],
      ['Palm Oil Bottle', 'Pure red palm oil for soups and stews.', 2500, image('photo-1474979266404-7eaacbcd87c5')]
    ],
    promotion: ['Weekend Food Basket Deal', 'Get fresh produce bundles at a discount this weekend.', '15% off', true]
  },
  {
    name: 'Delta Tech Repairs',
    category: 'Tech',
    state: 'Delta',
    address: '5 DSC Road, Warri',
    phone: '08098765432',
    email: 'support@deltatechrepairs.test',
    description: 'Fast phone, laptop and gadget repairs with diagnostics, accessories and same-day service options.',
    coverImageUrl: image('photo-1516321318423-f06f85e504b3'),
    logoUrl: image('photo-1518770660439-4636190af475'),
    products: [
      ['Phone Screen Replacement', 'Replacement for popular Android and iPhone models.', 18000, image('photo-1511707171634-5f897ff02aa9')],
      ['Laptop Diagnosis', 'Full laptop fault inspection and repair estimate.', 5000, image('photo-1496181133206-80ce9b88a853')],
      ['Charging Port Repair', 'Phone and tablet charging port repairs.', 7000, image('photo-1588508065123-287b28e013da')]
    ],
    promotion: ['Free Device Checkup', 'Bring your phone or laptop for a free basic check.', 'Free checkup', false]
  },
  {
    name: 'Asaba Beauty Studio',
    category: 'Beauty',
    state: 'Delta',
    address: '22 Nnebisi Road, Asaba',
    phone: '08122224444',
    email: 'bookings@asababeauty.test',
    description: 'Professional makeup, hair styling, facials, bridal glam and beauty training for young entrepreneurs.',
    coverImageUrl: image('photo-1560066984-138dadb4c035'),
    logoUrl: image('photo-1522337360788-8b13dee7a37e'),
    products: [
      ['Bridal Makeup Session', 'Full bridal glam with lashes and touch-up kit.', 45000, image('photo-1487412947147-5cebf100ffc2')],
      ['Natural Hair Styling', 'Protective styling and hair treatment package.', 12000, image('photo-1522337660859-02fbefca4702')],
      ['Facial Treatment', 'Deep cleansing facial for bright and healthy skin.', 15000, image('photo-1570172619644-dfd03ed5d881')]
    ],
    promotion: ['Bridal Glam Discount', 'Book this month and receive a free trial look.', '10% off', true]
  },
  {
    name: 'Kano Style Hub',
    category: 'Fashion',
    state: 'Kano',
    address: '18 Zoo Road, Kano',
    phone: '08134567890',
    email: 'orders@kanostylehub.test',
    description: 'Ready-to-wear kaftans, senator wears, modest fashion and custom tailoring for men and women.',
    coverImageUrl: image('photo-1445205170230-053b83016050'),
    logoUrl: image('photo-1496747611176-843222e1e57c'),
    products: [
      ['Senator Wear Set', 'Cleanly tailored senator outfit in premium fabric.', 35000, image('photo-1506629905607-d405d7d3b0d2')],
      ['Ankara Gown', 'Elegant ready-to-wear Ankara gown.', 22000, image('photo-1509631179647-0177331693ae')],
      ['Custom Kaftan', 'Made-to-measure kaftan for special events.', 30000, image('photo-1529139574466-a303027c1d8b')]
    ],
    promotion: ['Eid Collection Offer', 'Discount on selected kaftans and gowns.', '20% off', true]
  },
  {
    name: 'Port Harcourt Wellness Clinic',
    category: 'Health',
    state: 'Rivers',
    address: '41 Aba Road, Port Harcourt',
    phone: '08055556666',
    email: 'care@phwellness.test',
    description: 'Affordable wellness checks, pharmacy support, diet planning and home health consultations.',
    coverImageUrl: image('photo-1505751172876-fa1923c5c528'),
    logoUrl: image('photo-1584515933487-779824d29309'),
    products: [
      ['Basic Wellness Check', 'Blood pressure, sugar and BMI screening.', 6000, image('photo-1576091160550-2173dba999ef')],
      ['Diet Consultation', 'Personal meal plan with a wellness specialist.', 10000, image('photo-1490645935967-10de6ba17061')],
      ['Home Care Visit', 'Basic home checkup within Port Harcourt.', 18000, image('photo-1582750433449-648ed127bb54')]
    ],
    promotion: ['Family Wellness Week', 'Discounted checks for families of four.', '₦5,000 off', false]
  },
  {
    name: 'Abuja Event Services',
    category: 'Services',
    state: 'FCT',
    address: 'Suite 12, Garki Mall, Abuja',
    phone: '08077778888',
    email: 'events@abujaservices.test',
    description: 'Event planning, decoration, ushering, rentals and vendor coordination for weddings and corporate events.',
    coverImageUrl: image('photo-1511795409834-ef04bbd61622'),
    logoUrl: image('photo-1519225421980-715cb0215aed'),
    products: [
      ['Event Decoration Package', 'Venue styling with flowers, lights and table design.', 180000, image('photo-1464366400600-7168b8af9bc3')],
      ['Ushering Service', 'Trained ushers for formal events.', 50000, image('photo-1511578314322-379afb476865')],
      ['Canopy Rental', 'Canopies, chairs and tables for outdoor events.', 65000, image('photo-1478146896981-b80fe463b330')]
    ],
    promotion: ['Corporate Event Starter', 'Free consultation for corporate bookings.', 'Free consult', false]
  },
  {
    name: 'Ibadan Home Cleaners',
    category: 'Services',
    state: 'Oyo',
    address: '9 Ring Road, Ibadan',
    phone: '08199990000',
    email: 'hello@ibadancleaners.test',
    description: 'Reliable home, office and post-construction cleaning with trained cleaners and eco-friendly supplies.',
    coverImageUrl: image('photo-1581578731548-c64695cc6952'),
    logoUrl: image('photo-1527515637462-cff94eecc1ac'),
    products: [
      ['Home Deep Cleaning', 'Full apartment cleaning for bedrooms, kitchen and bathrooms.', 30000, image('photo-1528740561666-dc2479dc08ab')],
      ['Office Cleaning', 'Daily or weekly office maintenance cleaning.', 45000, image('photo-1497366754035-f200968a6e72')],
      ['Move-In Cleaning', 'Detailed post-renovation and move-in cleaning.', 55000, image('photo-1563453392212-326f5e854473')]
    ],
    promotion: ['New Home Package', 'Discount for first-time home cleaning customers.', '12% off', true]
  },
  {
    name: 'Enugu Agro Supplies',
    category: 'Others',
    state: 'Enugu',
    address: '33 Ogui Road, Enugu',
    phone: '08033332222',
    email: 'sales@enuguagro.test',
    description: 'Seeds, fertilizers, poultry feeds and simple farm tools for smallholder farmers and agribusiness owners.',
    coverImageUrl: image('photo-1500937386664-56d1dfef3854'),
    logoUrl: image('photo-1523348837708-15d4a09cfac2'),
    products: [
      ['Hybrid Maize Seeds', 'High-yield maize seeds for small farms.', 9000, image('photo-1551754655-cd27e38d2076')],
      ['Organic Fertilizer Bag', 'Soil-friendly fertilizer for vegetables and crops.', 14000, image('photo-1464226184884-fa280b87c399')],
      ['Poultry Feed', 'Starter feed for healthy poultry growth.', 11500, image('photo-1548550023-2bdb3c5beed7')]
    ],
    promotion: ['Planting Season Bundle', 'Save on seeds and fertilizer bundles.', '18% off', false]
  },
  {
    name: 'Benin Phone Market',
    category: 'Tech',
    state: 'Edo',
    address: '14 Mission Road, Benin City',
    phone: '08111110000',
    email: 'shop@beninphones.test',
    description: 'New phones, UK-used devices, accessories, phone swaps and warranty-backed gadget sales.',
    coverImageUrl: image('photo-1516321497487-e288fb19713f'),
    logoUrl: image('photo-1511707171634-5f897ff02aa9'),
    products: [
      ['UK Used Smartphone', 'Clean UK-used smartphone with warranty.', 145000, image('photo-1511707171634-5f897ff02aa9')],
      ['Bluetooth Earbuds', 'Wireless earbuds with charging case.', 18000, image('photo-1606220945770-b5b6c2c55bf1')],
      ['Fast Charger', 'Durable fast charger and cable set.', 9000, image('photo-1583863788434-e58a36330cf0')]
    ],
    promotion: ['Accessory Combo', 'Free pouch with selected phone purchases.', 'Free pouch', true]
  },
  {
    name: 'Uyo Fit Kitchen',
    category: 'Food',
    state: 'Akwa Ibom',
    address: '6 Oron Road, Uyo',
    phone: '08045454545',
    email: 'orders@uyofitkitchen.test',
    description: 'Healthy meals, weight-loss food plans, smoothies and corporate lunch packs delivered across Uyo.',
    coverImageUrl: image('photo-1498837167922-ddd27525d352'),
    logoUrl: image('photo-1546069901-ba9599a7e63c'),
    products: [
      ['Weekly Meal Plan', 'Five-day healthy lunch and dinner package.', 42000, image('photo-1547592180-85f173990554')],
      ['Smoothie Pack', 'Fresh fruit smoothie bundle.', 9500, image('photo-1502741224143-90386d7f8c82')],
      ['Office Lunch Bowl', 'Balanced meal bowl for office delivery.', 4500, image('photo-1543339308-43e59d6b73a6')]
    ],
    promotion: ['Healthy Week Deal', 'Discount on weekly meal plans.', '10% off', false]
  }
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bizpromo');
  await Promise.all([
    User.deleteMany({}),
    Business.deleteMany({}),
    Product.deleteMany({}),
    Promotion.deleteMany({}),
    Inquiry.deleteMany({}),
    Payment.deleteMany({})
  ]);

  const password = await bcrypt.hash('password123', 10);
  const [emeka, amaka, zainab, tola, admin] = await User.create([
    { name: 'Emeka Obi', email: 'emeka@bizpromo.com', password, role: 'owner', isSubscribed: true },
    { name: 'Amaka Chukwu', email: 'amaka@bizpromo.com', password, role: 'customer' },
    { name: 'Zainab Musa', email: 'zainab@bizpromo.com', password, role: 'owner', isSubscribed: true },
    { name: 'Tola Adeyemi', email: 'tola@bizpromo.com', password, role: 'customer' },
    { name: 'Admin User', email: 'admin@bizpromo.com', password, role: 'admin' }
  ]);

  const owners = [emeka, zainab];
  const customers = [amaka, tola];
  const businesses = [];
  const promotions = [];

  for (const [index, item] of businessSeed.entries()) {
    const owner = owners[index % owners.length];
    const business = await Business.create({
      owner: owner._id,
      name: item.name,
      category: item.category,
      state: item.state,
      address: item.address,
      phone: item.phone,
      email: item.email,
      description: item.description,
      logoUrl: item.logoUrl,
      coverImageUrl: item.coverImageUrl,
      isVerified: index % 3 === 0,
      isListed: true
    });
    businesses.push(business);

    await Product.create(item.products.map(([name, description, price, imageUrl], productIndex) => ({
      business: business._id,
      name,
      description,
      price,
      imageUrl,
      inStock: productIndex !== 2 || index % 4 !== 0
    })));

    const [title, description, discount, isBoosted] = item.promotion;
    const promotion = await Promotion.create({
      business: business._id,
      title,
      description,
      discount,
      startDate: new Date(),
      endDate: new Date(Date.now() + (7 + index) * 24 * 60 * 60 * 1000),
      imageUrl: item.coverImageUrl,
      isActive: true,
      isBoosted,
      boostPaymentRef: isBoosted ? `BIZPROMO-BOOST-DEMO-${index + 1}` : undefined
    });
    promotions.push(promotion);

    await Payment.create({
      user: owner._id,
      business: business._id,
      type: 'listing',
      amount: 200000,
      reference: `BIZPROMO-LISTING-DEMO-${index + 1}`,
      status: 'success',
      paystackResponse: { demo: true, status: 'success' }
    });

    if (isBoosted) {
      await Payment.create({
        user: owner._id,
        business: business._id,
        promotion: promotion._id,
        type: 'boost',
        amount: 50000,
        reference: `BIZPROMO-BOOST-DEMO-${index + 1}`,
        status: 'success',
        paystackResponse: { demo: true, status: 'success' }
      });
    }

    await Inquiry.create({
      business: business._id,
      sender: customers[index % customers.length]._id,
      senderName: customers[index % customers.length].name,
      senderEmail: customers[index % customers.length].email,
      message: `Hello ${item.name}, I am interested in your services. Please send me more details about pricing and delivery.`,
      isRead: index % 2 === 0
    });
  }

  const hiddenBusiness = await Business.create({
    owner: emeka._id,
    name: 'Unpublished Demo Store',
    category: 'Others',
    state: 'Lagos',
    address: 'Pending listing address',
    phone: '08000000000',
    description: 'This business demonstrates an unpaid listing state.',
    logoUrl: image('photo-1497366811353-6870744d04b2'),
    coverImageUrl: image('photo-1497366754035-f200968a6e72'),
    isListed: false
  });

  await Payment.create({
    user: emeka._id,
    business: hiddenBusiness._id,
    type: 'listing',
    amount: 200000,
    reference: 'BIZPROMO-LISTING-PENDING-DEMO',
    status: 'pending',
    paystackResponse: { demo: true }
  });

  console.log(`BizPromo seed data inserted: ${businesses.length + 1} businesses, ${promotions.length} promotions.`);
  console.log('Demo users: emeka@bizpromo.com, zainab@bizpromo.com, amaka@bizpromo.com, admin@bizpromo.com / password123');
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
