// routes/orderRoutes.mjs
import express from "express";
import Order from "../models/Order.mjs";
import Session from "../models/Session.mjs";
import MenuItem from "../models/MenuItem.mjs";

const router = express.Router();

// Get all orders for a device
router.get("/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const orders = await Order.find({ deviceId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get a specific order
router.get("/detail/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order detail error:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { deviceId, items } = req.body;

    if (!deviceId || !items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Device ID and at least one item are required" });
    }

    // Validate items and calculate total
    const validatedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);

      if (!menuItem) {
        return res
          .status(400)
          .json({ error: `Menu item not found: ${item.menuItemId}` });
      }

      let itemPrice = menuItem.price;
      const selectedOptions = [];

      // Process selected options
      if (item.options && Array.isArray(item.options)) {
        for (const optionId of item.options) {
          const option = menuItem.options.find(
            (opt) => opt._id.toString() === optionId
          );

          if (option) {
            selectedOptions.push({
              name: option.name,
              additionalPrice: option.additionalPrice,
            });

            itemPrice += option.additionalPrice;
          }
        }
      }

      const itemTotal = itemPrice * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        selectedOptions,
      });
    }

    // Create order
    const order = new Order({
      deviceId,
      items: validatedItems,
      totalAmount,
      status: "current",
    });

    await order.save();

    // Update session with new order
    const session = await Session.findOne({ deviceId });

    if (session) {
      session.currentOrderId = order._id;
      await session.save();
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Update order (add/remove items or change quantity)
router.put("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action, itemId, menuItemId, quantity, options } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    switch (action) {
      case "add":
        if (!menuItemId) {
          return res.status(400).json({ error: "Menu item ID is required" });
        }

        const menuItem = await MenuItem.findById(menuItemId);

        if (!menuItem) {
          return res.status(400).json({ error: "Menu item not found" });
        }

        // Process selected options
        const selectedOptions = [];
        if (options && Array.isArray(options)) {
          for (const optionId of options) {
            const option = menuItem.options.find(
              (opt) => opt._id.toString() === optionId
            );

            if (option) {
              selectedOptions.push({
                name: option.name,
                // routes/orderRoutes.mjs (continued)
                additionalPrice: option.additionalPrice,
              });
            }
          }
        }

        // Check if item already exists
        const existingItemIndex = order.items.findIndex(
          (item) => item.menuItem.toString() === menuItemId
        );

        if (existingItemIndex !== -1) {
          // Update existing item
          order.items[existingItemIndex].quantity += quantity || 1;
        } else {
          // Add new item
          order.items.push({
            menuItem: menuItem._id,
            name: menuItem.name,
            quantity: quantity || 1,
            price: menuItem.price,
            selectedOptions,
          });
        }

        break;

      case "remove":
        if (!itemId) {
          return res.status(400).json({ error: "Item ID is required" });
        }

        // Remove item from order
        order.items = order.items.filter(
          (item) => item._id.toString() !== itemId
        );
        break;

      case "update":
        if (!itemId) {
          return res.status(400).json({ error: "Item ID is required" });
        }

        // Update item quantity
        const itemToUpdate = order.items.find(
          (item) => item._id.toString() === itemId
        );

        if (!itemToUpdate) {
          return res.status(400).json({ error: "Item not found in order" });
        }

        if (quantity <= 0) {
          // Remove item if quantity is zero or negative
          order.items = order.items.filter(
            (item) => item._id.toString() !== itemId
          );
        } else {
          itemToUpdate.quantity = quantity;
        }

        break;

      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    // Recalculate total
    order.calculateTotal();
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Update order status
router.patch("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (
      ![
        "pending",
        "current",
        "placed",
        "paid",
        "completed",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;

    // If order is cancelled, update session
    if (status === "cancelled") {
      const session = await Session.findOne({ deviceId: order.deviceId });

      if (
        session &&
        session.currentOrderId &&
        session.currentOrderId.toString() === orderId
      ) {
        session.currentOrderId = null;
        await session.save();
      }
    }

    // If order is placed, add to history
    if (status === "placed" || status === "paid" || status === "completed") {
      const session = await Session.findOne({ deviceId: order.deviceId });

      if (session) {
        if (!session.history.includes(orderId)) {
          session.history.push(orderId);
        }

        if (status === "paid" || status === "completed") {
          session.currentOrderId = null;
        }

        await session.save();
      }
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Schedule an order
router.patch("/:orderId/schedule", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { scheduledFor } = req.body;

    if (!scheduledFor) {
      return res
        .status(400)
        .json({ error: "Scheduled date and time are required" });
    }

    const scheduledDate = new Date(scheduledFor);

    if (isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.scheduledFor = scheduledDate;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Schedule order error:", error);
    res.status(500).json({ error: "Failed to schedule order" });
  }
});

export default router;
