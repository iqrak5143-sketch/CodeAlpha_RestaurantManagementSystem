const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const MenuItem = require("../models/MenuItem");
const RestaurantTable = require("../models/RestaurantTable");
const Inventory = require("../models/Inventory");

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("table")
            .sort({ createdAt: -1 });

        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await OrderItem.find({
                    order: order._id
                }).populate("menuItem");

                return {
                    ...order.toObject(),
                    items
                };
            })
        );

        res.status(200).json({
            success: true,
            count: ordersWithItems.length,
            data: ordersWithItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("table");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const items = await OrderItem.find({
            order: order._id
        }).populate("menuItem");

        res.status(200).json({
            success: true,
            data: {
                ...order.toObject(),
                items
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};

const createOrder = async (req, res) => {
    try {
        const {
            table,
            customerName,
            items
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one item"
            });
        }

        const restaurantTable = await RestaurantTable.findById(table);

        if (!restaurantTable) {
            return res.status(404).json({
                success: false,
                message: "Restaurant table not found"
            });
        }

        const preparedItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem);

            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: `Menu item not found: ${item.menuItem}`
                });
            }

            if (!menuItem.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: `${menuItem.name} is currently unavailable`
                });
            }

            const inventory = await Inventory.findOne({
                menuItem: item.menuItem
            });

            if (!inventory) {
                return res.status(404).json({
                    success: false,
                    message: `Inventory not found for ${menuItem.name}`
                });
            }

            if (inventory.quantity < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${menuItem.name}. Available: ${inventory.quantity}`
                });
            }

            const subtotal = menuItem.price * item.quantity;

            preparedItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price,
                subtotal
            });

            totalAmount += subtotal;
        }

        const order = await Order.create({
            table,
            customerName,
            totalAmount,
            status: "pending"
        });

        const orderItems = preparedItems.map((item) => ({
            order: order._id,
            ...item
        }));

        await OrderItem.insertMany(orderItems);

        for (const item of preparedItems) {
            await Inventory.findOneAndUpdate(
                {
                    menuItem: item.menuItem
                },
                {
                    $inc: {
                        quantity: -item.quantity
                    }
                }
            );
        }

        await RestaurantTable.findByIdAndUpdate(table, {
            status: "occupied"
        });

        const savedOrder = await Order.findById(order._id)
            .populate("table");

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: savedOrder,
            items: orderItems
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create order",
            error: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "preparing",
            "ready",
            "served",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;
        await order.save();

        if (status === "served" || status === "cancelled") {
            await RestaurantTable.findByIdAndUpdate(order.table, {
                status: "available"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update order status",
            error: error.message
        });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
};