const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RestaurantTable",
            required: true
        },

        customerName: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["pending", "preparing", "ready", "served", "cancelled"],
            default: "pending"
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);