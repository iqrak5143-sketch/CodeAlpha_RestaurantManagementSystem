const Inventory = require("../models/Inventory");

const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find()
            .populate("menuItem")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: inventory.length,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch inventory",
            error: error.message
        });
    }
};

const getLowStockItems = async (req, res) => {
    try {
        const inventory = await Inventory.find({
            $expr: {
                $lte: ["$quantity", "$lowStockThreshold"]
            }
        })
            .populate("menuItem")
            .sort({ quantity: 1 });

        res.status(200).json({
            success: true,
            count: inventory.length,
            data: inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch low stock items",
            error: error.message
        });
    }
};

const createInventory = async (req, res) => {
    try {
        const {
            menuItem,
            quantity,
            unit,
            lowStockThreshold
        } = req.body;

        const existingInventory = await Inventory.findOne({
            menuItem
        });

        if (existingInventory) {
            return res.status(409).json({
                success: false,
                message: "Inventory already exists for this menu item"
            });
        }

        const inventory = await Inventory.create({
            menuItem,
            quantity,
            unit,
            lowStockThreshold
        });

        res.status(201).json({
            success: true,
            message: "Inventory created successfully",
            data: inventory
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create inventory",
            error: error.message
        });
    }
};

const updateInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("menuItem");

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory record not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Inventory updated successfully",
            data: inventory
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update inventory",
            error: error.message
        });
    }
};

module.exports = {
    getInventory,
    getLowStockItems,
    createInventory,
    updateInventory
};