const RestaurantTable = require("../models/RestaurantTable");

const getTables = async (req, res) => {
    try {
        const tables = await RestaurantTable.find().sort({ tableNumber: 1 });

        res.status(200).json({
            success: true,
            count: tables.length,
            data: tables
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch tables",
            error: error.message
        });
    }
};

const getAvailableTables = async (req, res) => {
    try {
        const tables = await RestaurantTable.find({
            status: "available"
        }).sort({ tableNumber: 1 });

        res.status(200).json({
            success: true,
            count: tables.length,
            data: tables
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch available tables",
            error: error.message
        });
    }
};

const createTable = async (req, res) => {
    try {
        const { tableNumber, capacity, status } = req.body;

        const existingTable = await RestaurantTable.findOne({
            tableNumber
        });

        if (existingTable) {
            return res.status(409).json({
                success: false,
                message: "Table number already exists"
            });
        }

        const table = await RestaurantTable.create({
            tableNumber,
            capacity,
            status
        });

        res.status(201).json({
            success: true,
            message: "Restaurant table created successfully",
            data: table
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create table",
            error: error.message
        });
    }
};

module.exports = {
    getTables,
    getAvailableTables,
    createTable
};