const express = require("express");

const {
    getTables,
    getAvailableTables,
    createTable
} = require("../controllers/tableController");

const router = express.Router();

router.get("/", getTables);

router.get("/available", getAvailableTables);

router.post("/", createTable);

module.exports = router;