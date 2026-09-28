const Reservation = require("../models/Reservation");
const RestaurantTable = require("../models/RestaurantTable");

const getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate("table")
            .sort({ reservationDate: 1 });

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch reservations",
            error: error.message
        });
    }
};

const createReservation = async (req, res) => {
    try {
        const {
            customerName,
            customerPhone,
            table,
            reservationDate,
            reservationTime,
            numberOfGuests
        } = req.body;

        const restaurantTable = await RestaurantTable.findById(table);

        if (!restaurantTable) {
            return res.status(404).json({
                success: false,
                message: "Restaurant table not found"
            });
        }

        if (numberOfGuests > restaurantTable.capacity) {
            return res.status(400).json({
                success: false,
                message: "Number of guests exceeds table capacity"
            });
        }

        const existingReservation = await Reservation.findOne({
            table,
            reservationDate,
            reservationTime,
            status: {
                $in: ["pending", "confirmed"]
            }
        });

        if (existingReservation) {
            return res.status(409).json({
                success: false,
                message: "Table is already reserved for this date and time"
            });
        }

        const reservation = await Reservation.create({
            customerName,
            customerPhone,
            table,
            reservationDate,
            reservationTime,
            numberOfGuests
        });

        await RestaurantTable.findByIdAndUpdate(table, {
            status: "reserved"
        });

        res.status(201).json({
            success: true,
            message: "Table reserved successfully",
            data: reservation
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create reservation",
            error: error.message
        });
    }
};

const cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservation not found"
            });
        }

        reservation.status = "cancelled";
        await reservation.save();

        await RestaurantTable.findByIdAndUpdate(reservation.table, {
            status: "available"
        });

        res.status(200).json({
            success: true,
            message: "Reservation cancelled successfully",
            data: reservation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to cancel reservation",
            error: error.message
        });
    }
};

module.exports = {
    getReservations,
    createReservation,
    cancelReservation
};