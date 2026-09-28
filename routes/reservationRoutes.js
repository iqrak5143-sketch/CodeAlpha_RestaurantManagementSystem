const express = require("express");

const {
    getReservations,
    createReservation,
    cancelReservation
} = require("../controllers/reservationController");

const router = express.Router();

router.get("/", getReservations);

router.post("/", createReservation);

router.patch("/:id/cancel", cancelReservation);

module.exports = router;