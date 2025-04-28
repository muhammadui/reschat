// routes/chatRoutes.mjs
import express from "express";
import Session from "../models/Session.mjs";
import Order from "../models/Order.mjs";
import MenuItem from "../models/MenuItem.mjs";

const router = express.Router();

// Helper functions for chat responses
const getMainMenu = () => {
  return {
    message:
      "Welcome to Nigerian Delicacies Restaurant! How can I help you today?",
    options: [
      { id: "1", text: "Place an order" },
      { id: "99", text: "Checkout order" },
      { id: "98", text: "See order history" },
      { id: "97", text: "See current order" },
      { id: "0", text: "Cancel order" },
    ],
  };
};

const getMenuItems = async () => {
  const items = await MenuItem.find().sort({ culture: 1, category: 1 });

  const formattedItems = items.map((item, index) => ({
    id: (index + 1).toString(),
    name: item.name,
    description: item.description,
    price: `₦${item.price.toLocaleString("en-NG")}`,
    _id: item._id,
  }));

  return {
    message: "Here's our menu. Please select an item by number:",
    items: formattedItems,
  };
};

// Get or create user session
router.post("/session", async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: "Device ID is required" });
    }

    let session = await Session.findOne({ deviceId }).populate(
      "currentOrderId"
    );

    if (!session) {
      session = new Session({ deviceId });
      await session.save();
    }

    // Send initial menu
    res.json({
      sessionId: session._id,
      ...getMainMenu(),
    });
  } catch (error) {
    console.error("Session error:", error);
    res.status(500).json({ error: "Failed to initialize session" });
  }
});

// Process chat messages
router.post("/message", async (req, res) => {
  try {
    const { deviceId, message } = req.body;

    if (!deviceId || !message) {
      return res
        .status(400)
        .json({ error: "Device ID and message are required" });
    }

    let session = await Session.findOne({ deviceId }).populate(
      "currentOrderId"
    );

    if (!session) {
      session = new Session({ deviceId });
      await session.save();
      return res.json(getMainMenu());
    }

    // Update last interaction time
    session.lastInteraction = new Date();
    await session.save();

    // Process user input
    switch (message) {
      case "1": // Place an order
        const menuResponse = await getMenuItems();
        return res.json(menuResponse);

      case "99": // Checkout order
        if (
          !session.currentOrderId ||
          session.currentOrderId.items.length === 0
        ) {
          return res.json({
            message: "No order to place. Would you like to place a new order?",
            options: [
              { id: "1", text: "Place an order" },
              { id: "main", text: "Back to main menu" },
            ],
          });
        }

        // Set order status to placed
        const order = await Order.findById(session.currentOrderId._id);
        order.status = "placed";
        await order.save();

        return res.json({
          message: "Order placed! Would you like to proceed to payment?",
          orderId: order._id,
          totalAmount: `₦${order.totalAmount.toLocaleString("en-NG")}`,
          options: [
            { id: "pay", text: "Pay now" },
            { id: "main", text: "Back to main menu" },
          ],
        });

      case "98": // See order history
        const orderHistory = await Order.find({
          deviceId,
          status: { $in: ["placed", "paid", "completed"] },
        }).sort({ createdAt: -1 });

        if (orderHistory.length === 0) {
          return res.json({
            message: "You have no order history yet.",
            options: [
              { id: "1", text: "Place an order" },
              { id: "main", text: "Back to main menu" },
            ],
          });
        }

        return res.json({
          message: "Your order history:",
          orders: orderHistory.map((order) => ({
            id: order._id,
            date: order.createdAt.toLocaleDateString(),
            items: order.items.length,
            total: `₦${order.totalAmount.toLocaleString("en-NG")}`,
            status: order.status,
          })),
          options: [{ id: "main", text: "Back to main menu" }],
        });

      case "97": // See current order
        if (
          !session.currentOrderId ||
          session.currentOrderId.items.length === 0
        ) {
          return res.json({
            message: "You have no current order.",
            options: [
              { id: "1", text: "Place an order" },
              { id: "main", text: "Back to main menu" },
            ],
          });
        }

        const currentOrder = await Order.findById(
          session.currentOrderId._id
        ).populate("items.menuItem");

        return res.json({
          message: "Your current order:",
          order: {
            id: currentOrder._id,
            items: currentOrder.items.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              price: `₦${item.price.toLocaleString("en-NG")}`,
              options: item.selectedOptions,
            })),
            total: `₦${currentOrder.totalAmount.toLocaleString("en-NG")}`,
          },
          options: [
            { id: "1", text: "Add more items" },
            { id: "99", text: "Checkout" },
            { id: "0", text: "Cancel order" },
            { id: "main", text: "Back to main menu" },
          ],
        });

      case "0": // Cancel order
        if (!session.currentOrderId) {
          return res.json({
            message: "You have no order to cancel.",
            options: [
              { id: "1", text: "Place an order" },
              { id: "main", text: "Back to main menu" },
            ],
          });
        }

        // Cancel the order
        const orderToCancel = await Order.findById(session.currentOrderId._id);
        orderToCancel.status = "cancelled";
        await orderToCancel.save();

        // Remove reference from session
        session.currentOrderId = null;
        await session.save();

        return res.json({
          message: "Your order has been cancelled.",
          options: [
            { id: "1", text: "Place a new order" },
            { id: "main", text: "Back to main menu" },
          ],
        });

      case "main": // Back to main menu
        return res.json(getMainMenu());

      case "pay": // Process payment
        if (!session.currentOrderId) {
          return res.json({
            message: "No order to pay for.",
            options: [
              { id: "1", text: "Place an order" },
              { id: "main", text: "Back to main menu" },
            ],
          });
        }

        const orderToPay = await Order.findById(session.currentOrderId._id);

        return res.json({
          message: "Proceed to payment",
          paymentInfo: {
            orderId: orderToPay._id,
            amount: orderToPay.totalAmount,
            formattedAmount: `₦${orderToPay.totalAmount.toLocaleString(
              "en-NG"
            )}`,
          },
          options: [
            { id: "initiate_payment", text: "Continue to payment" },
            { id: "main", text: "Back to main menu" },
          ],
        });

      default:
        // Check if it's a menu item selection (numeric)
        if (/^\d+$/.test(message)) {
          const selectedIndex = parseInt(message) - 1;
          const menuItems = await MenuItem.find().sort({
            culture: 1,
            category: 1,
          });

          if (selectedIndex >= 0 && selectedIndex < menuItems.length) {
            const selectedItem = menuItems[selectedIndex];

            return res.json({
              message: `You selected: ${
                selectedItem.name
              } - ₦${selectedItem.price.toLocaleString("en-NG")}`,
              item: {
                id: selectedItem._id,
                name: selectedItem.name,
                description: selectedItem.description,
                price: selectedItem.price,
                options: selectedItem.options,
              },
              options: [
                { id: `add_to_cart:${selectedItem._id}`, text: "Add to cart" },
                { id: "1", text: "Select another item" },
                { id: "main", text: "Back to main menu" },
              ],
            });
          }
        }

        // Check if it's adding to cart
        if (message.startsWith("add_to_cart:")) {
          const itemId = message.split(":")[1];
          const quantity = 1; // Default quantity

          const menuItem = await MenuItem.findById(itemId);
          if (!menuItem) {
            return res.json({
              message: "Item not found. Please try again.",
              options: [
                { id: "1", text: "View menu" },
                { id: "main", text: "Back to main menu" },
              ],
            });
          }

          // Create or update order
          let order;
          if (!session.currentOrderId) {
            order = new Order({
              deviceId,
              items: [
                {
                  menuItem: menuItem._id,
                  name: menuItem.name,
                  quantity,
                  price: menuItem.price,
                  selectedOptions: [],
                },
              ],
              totalAmount: menuItem.price * quantity,
              status: "current",
            });

            await order.save();
            session.currentOrderId = order._id;
            await session.save();
          } else {
            order = await Order.findById(session.currentOrderId._id);

            // Check if item already exists in the order
            const existingItemIndex = order.items.findIndex(
              (item) => item.menuItem.toString() === menuItem._id.toString()
            );

            if (existingItemIndex !== -1) {
              // Update existing item quantity
              order.items[existingItemIndex].quantity += quantity;
            } else {
              // Add new item
              order.items.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                quantity,
                price: menuItem.price,
                selectedOptions: [],
              });
            }

            order.calculateTotal();
            await order.save();
          }

          return res.json({
            message: `${menuItem.name} added to your order.`,
            options: [
              { id: "1", text: "Add more items" },
              { id: "97", text: "View current order" },
              { id: "99", text: "Checkout" },
              { id: "main", text: "Back to main menu" },
            ],
          });
        }

        // For any other message, return the main menu
        return res.json({
          message: "I didn't understand that. How can I help you?",
          ...getMainMenu(),
        });
    }
  } catch (error) {
    console.error("Chat message processing error:", error);
    res.status(500).json({
      error: "Failed to process message",
      message: "Sorry, something went wrong. Please try again.",
      options: [{ id: "main", text: "Back to main menu" }],
    });
  }
});

export default router;
