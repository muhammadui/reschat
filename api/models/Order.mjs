// models/Order.mjs
import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  selectedOptions: [
    {
      name: String,
      additionalPrice: Number,
    },
  ],
});

const OrderSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "current", "placed", "paid", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentReference: String,
    scheduledFor: Date,
  },
  { timestamps: true }
);

OrderSchema.methods.calculateTotal = function () {
  this.totalAmount = this.items.reduce((sum, item) => {
    let itemTotal = item.price * item.quantity;
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      itemTotal +=
        item.selectedOptions.reduce(
          (optionSum, option) => optionSum + (option.additionalPrice || 0),
          0
        ) * item.quantity;
    }
    return sum + itemTotal;
  }, 0);
  return this.totalAmount;
};

export default mongoose.model("Order", OrderSchema);
