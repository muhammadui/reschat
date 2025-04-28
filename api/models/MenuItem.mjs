// models/MenuItem.mjs
import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["main", "side", "drink", "dessert"],
    },
    culture: {
      type: String,
      required: true,
      enum: ["hausa", "yoruba", "igbo", "igala", "general"],
    },
    image: {
      type: String,
    },
    options: [
      {
        name: String,
        additionalPrice: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", MenuItemSchema);
