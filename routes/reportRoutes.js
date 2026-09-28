const express = require("express");

const {
    getDailySalesReport
} = require("../controllers/reportController");

const router = express.Router();

router.get("/daily-sales", getDailySalesReport);

module.exports = router;