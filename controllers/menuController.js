const MenuItem = require("../models/MenuItem");

const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: menuItems.length,
            data: menuItems
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu items",
            error: error.message
        });
    }
};

const getMenuItemById = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch menu item",
            error: error.message
        });
    }
};

const createMenuItem = async (req, res) => {
    try {
        const { name, description, category, price, isAvailable } = req.body;

        const menuItem = await MenuItem.create({
            name,
            description,
            category,
            price,
            isAvailable
        });

        res.status(201).json({
            success: true,
            message: "Menu item created successfully",
            data: menuItem
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create menu item",
            error: error.message
        });
    }
};

module.exports = {
    getMenuItems,
    getMenuItemById,
    createMenuItem
};