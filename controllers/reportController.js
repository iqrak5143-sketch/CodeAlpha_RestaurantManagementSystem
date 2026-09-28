const Order = require("../models/Order");

const getDailySalesReport = async (req, res) => {
    try {
        const { date } = req.query;

       let selectedDate;

if (date) {
    const dateParts = date.split("-");

    if (dateParts.length === 3 && dateParts[0].length === 2) {
        const [day, month, year] = dateParts;

        selectedDate = new Date(
            `${year}-${month}-${day}`
        );
    } else {
        selectedDate = new Date(date);
    }
}

if (!date) {
    selectedDate = new Date();
}

if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({
        success: false,
        message: "Invalid date format. Use DD-MM-YYYY or YYYY-MM-DD"
    });
}
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: {
                $ne: "cancelled"
            }
        });

        const totalOrders = orders.length;

        const totalSales = orders.reduce(
            (total, order) => total + order.totalAmount,
            0
        );

        res.status(200).json({
            success: true,
            data: {
            date: `${String(startOfDay.getDate()).padStart(2, "0")}-${String(
            startOfDay.getMonth() + 1
            ).padStart(2, "0")}-${startOfDay.getFullYear()}`,

            totalOrders,
            totalSales
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to generate daily sales report",
            error: error.message
        });
    }
};

module.exports = {
    getDailySalesReport
};