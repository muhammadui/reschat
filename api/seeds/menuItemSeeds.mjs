// seeds/menuItemSeeds.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "../models/MenuItem.mjs";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/nigerian-restaurant"
  )
  .then(() => console.log("Connected to MongoDB for seeding"))
  .catch((err) => console.error("MongoDB connection error:", err));

const menuItems = [
  // Yoruba Foods
  {
    name: "Amala and Ewedu",
    description:
      "Soft yam flour with slippery jute leaves soup, served with assorted meat",
    price: 2500,
    category: "main",
    culture: "yoruba",
    image: "/images/amala-ewedu.jpg",
    options: [
      { name: "Add Gbegiri (bean soup)", additionalPrice: 500 },
      { name: "Extra Assorted Meat", additionalPrice: 1000 },
      { name: "Add Ponmo (cow skin)", additionalPrice: 700 },
    ],
  },
  {
    name: "Iyan (Pounded Yam) with Egusi",
    description:
      "Smooth pounded yam with melon seed soup rich in vegetables and protein",
    price: 3000,
    category: "main",
    culture: "yoruba",
    image: "/images/iyan-egusi.jpg",
    options: [
      { name: "Fish (Tilapia)", additionalPrice: 1200 },
      { name: "Goat Meat", additionalPrice: 1500 },
      { name: "Extra Vegetables", additionalPrice: 300 },
    ],
  },

  // Igbo Foods
  {
    name: "Ofe Nsala with Fufu",
    description: "White soup with catfish and fufu (cassava meal)",
    price: 3200,
    category: "main",
    culture: "igbo",
    image: "/images/ofe-nsala.jpg",
    options: [
      { name: "Extra Fish", additionalPrice: 1000 },
      { name: "Add Utazi Leaves", additionalPrice: 300 },
    ],
  },
  {
    name: "Ofe Akwu with Garri",
    description: "Palm nut soup with seafood, served with eba (garri)",
    price: 2800,
    category: "main",
    culture: "igbo",
    image: "/images/ofe-akwu.jpg",
    options: [
      { name: "Add Periwinkle", additionalPrice: 700 },
      { name: "Add Stock Fish", additionalPrice: 900 },
    ],
  },

  // Hausa Foods
  {
    name: "Tuwo Shinkafa with Miyan Kuka",
    description: "Rice pudding with baobab leaf soup",
    price: 2300,
    category: "main",
    culture: "hausa",
    image: "/images/tuwo-miyan-kuka.jpg",
    options: [
      { name: "Add Dried Fish", additionalPrice: 800 },
      { name: "Extra Meat", additionalPrice: 1000 },
    ],
  },
  {
    name: "Masa with Suya",
    description: "Rice cake with spicy grilled beef skewers",
    price: 2000,
    category: "main",
    culture: "hausa",
    image: "/images/masa-suya.jpg",
    options: [
      { name: "Extra Suya Portion", additionalPrice: 1200 },
      { name: "Add Pepper Sauce", additionalPrice: 300 },
    ],
  },

  // Igala Foods
  {
    name: "Eba with Okoho Soup",
    description: "Garri with mucilaginous soup made from okoho plant",
    price: 2600,
    category: "main",
    culture: "igala",
    image: "/images/eba-okoho.jpg",
    options: [
      { name: "Add Smoked Fish", additionalPrice: 800 },
      { name: "Extra Meat", additionalPrice: 1000 },
    ],
  },
  {
    name: "Akpu with Banga Soup",
    description: "Fermented cassava meal with palm fruit soup",
    price: 2700,
    category: "main",
    culture: "igala",
    image: "/images/akpu-banga.jpg",
    options: [
      { name: "Add Dried Crayfish", additionalPrice: 500 },
      { name: "Add Fresh Fish", additionalPrice: 1000 },
    ],
  },

  // Side Dishes
  {
    name: "Moi Moi",
    description: "Steamed bean pudding with fish or egg",
    price: 1000,
    category: "side",
    culture: "general",
    image: "/images/moi-moi.jpg",
    options: [
      { name: "With Egg", additionalPrice: 200 },
      { name: "With Fish", additionalPrice: 300 },
    ],
  },
  {
    name: "Dodo (Fried Plantain)",
    description: "Sweet fried plantain slices",
    price: 800,
    category: "side",
    culture: "general",
    image: "/images/dodo.jpg",
    options: [],
  },

  // Drinks
  {
    name: "Zobo",
    description: "Hibiscus flower drink",
    price: 500,
    category: "drink",
    culture: "general",
    image: "/images/zobo.jpg",
    options: [
      { name: "Add Ginger", additionalPrice: 100 },
      { name: "Add Pineapple Flavor", additionalPrice: 150 },
    ],
  },
  {
    name: "Kunu",
    description: "Millet drink",
    price: 500,
    category: "drink",
    culture: "hausa",
    image: "/images/kunu.jpg",
    options: [{ name: "Add Tamarind", additionalPrice: 100 }],
  },

  // Desserts
  {
    name: "Puff Puff",
    description: "Deep-fried dough balls",
    price: 700,
    category: "dessert",
    culture: "general",
    image: "/images/puff-puff.jpg",
    options: [
      { name: "With Sugar Coating", additionalPrice: 100 },
      { name: "With Chocolate Dip", additionalPrice: 300 },
    ],
  },
  {
    name: "Chin Chin",
    description: "Crunchy fried pastry",
    price: 600,
    category: "dessert",
    culture: "general",
    image: "/images/chin-chin.jpg",
    options: [],
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log("Cleared existing menu items");

    // Insert new menu items
    const createdItems = await MenuItem.insertMany(menuItems);
    console.log(`Inserted ${createdItems.length} menu items`);

    mongoose.connection.close();
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
};

seedDatabase();
