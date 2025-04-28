// routes/paymentRoutes.mjs
import express from "express";
import axios from "axios";
import crypto from "crypto";
import Order from "../models/Order.mjs";
import Session from "../models/Session.mjs";

const router = express.Router();

// Initialize payment with Paystack
router.post("/initialize", async (req, res) => {
  try {
    const { orderId, email } = req.body;

    if (!orderId || !email) {
      return res.status(400).json({ error: "Order ID and email are required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if order is already paid
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ error: "Order is already paid" });
    }

    // Generate unique reference
    const reference = `ORDER_${orderId}_${Date.now()}`;

    // Initialize Paystack transaction
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: order.totalAmount * 100, // Convert to kobo (smallest currency unit)
        reference,
        callback_url: `${process.env.FRONTEND_URL}/payment/verify/${orderId}`,
        metadata: {
          orderId: orderId,
          deviceId: order.deviceId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Update order with payment reference
    order.paymentReference = reference;
    await order.save();

    res.json({
      success: true,
      data: response.data.data,
      message: "Payment initialized",
    });
  } catch (error) {
    console.error(
      "Initialize payment error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to initialize payment" });
  }
});

// Verify payment
router.get("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify transaction with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, data } = response.data;

    if (status && data.status === "success") {
      // Extract orderId from reference (assuming format ORDER_id_timestamp)
      const orderId = reference.split("_")[1];

      // Update order status
      const order = await Order.findById(orderId);

      if (order) {
        order.paymentStatus = "paid";
        order.status = "paid";
        await order.save();

        // Update session
        const session = await Session.findOne({ deviceId: order.deviceId });

        if (
          session &&
          session.currentOrderId &&
          session.currentOrderId.toString() === orderId
        ) {
          session.currentOrderId = null;

          // Ensure order is in history
          if (!session.history.includes(orderId)) {
            session.history.push(orderId);
          }

          await session.save();
        }
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          orderId,
          amount: data.amount / 100, // Convert from kobo back to naira
          status: data.status,
        },
      });
    } else {
      res.json({
        success: false,
        message: "Payment verification failed",
        data: response.data,
      });
    }
  } catch (error) {
    console.error(
      "Verify payment error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// Webhook for Paystack events
router.post("/webhook", async (req, res) => {
  try {
    // Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Process webhook
    const event = req.body;

    if (event.event === "charge.success") {
      const { reference } = event.data;

      // Extract orderId from reference
      const orderId = reference.split("_")[1];

      // Update order status
      const order = await Order.findById(orderId);

      if (order) {
        order.paymentStatus = "paid";
        order.status = "paid";
        await order.save();

        // Update session
        const session = await Session.findOne({ deviceId: order.deviceId });

        if (
          session &&
          session.currentOrderId &&
          session.currentOrderId.toString() === orderId
        ) {
          session.currentOrderId = null;

          // Ensure order is in history
          if (!session.history.includes(orderId)) {
            session.history.push(orderId);
          }

          await session.save();
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

export default router;
