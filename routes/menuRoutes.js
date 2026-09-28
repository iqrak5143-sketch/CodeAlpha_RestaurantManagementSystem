const express = require("express");

const {
    getMenuItems,
    getMenuItemById,
    createMenuItem
} = require("../controllers/menuController");

const router = express.Router();

router.get("/", getMenuItems);

router.get("/:id", getMenuItemById);

router.post("/", createMenuItem);

module.exports = router;