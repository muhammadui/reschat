// server.mjs
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import orderRoutes from "./routes/orderRoutes.mjs";
import chatRoutes from "./routes/chatRoutes.mjs";
import paymentRoutes from "./routes/paymentRoutes.mjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Set up Socket.io for real-time chat
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/nigerian-restaurant"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);

// Socket.io message handling
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("message", async (data) => {
    // Process user message and respond
    try {
      // Handle chat bot logic here or via API
      socket.emit("message", {
        from: "bot",
        text: "Message received",
        options: [],
      });
    } catch (error) {
      console.error("Error processing message:", error);
      socket.emit("message", {
        from: "bot",
        text: "Sorry, there was an error processing your request.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
