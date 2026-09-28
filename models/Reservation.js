const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            trim: true
        },

        customerPhone: {
            type: String,
            required: true,
            trim: true
        },

        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RestaurantTable",
            required: true
        },

        reservationDate: {
            type: Date,
            required: true
        },

        reservationTime: {
            type: String,
            required: true,
            trim: true
        },

        numberOfGuests: {
            type: Number,
            required: true,
            min: 1
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Reservation", reservationSchema);