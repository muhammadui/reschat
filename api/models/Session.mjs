// models/Session.mjs
import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    currentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    lastInteraction: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Session", SessionSchema);
