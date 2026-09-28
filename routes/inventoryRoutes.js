const express = require("express");

const {
    getInventory,
    getLowStockItems,
    createInventory,
    updateInventory
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", getInventory);

router.get("/low-stock", getLowStockItems);

router.post("/", createInventory);

router.patch("/:id", updateInventory);

module.exports = router;