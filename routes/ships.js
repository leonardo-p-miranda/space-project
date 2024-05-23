const express = require("express");

const {
  createShip,
  getShips,
  getShip,
  deleteShip,
  updateShip,
} = require("../controllers/ships.js");

const router = express.Router();

router.get("/", getShips);

router.post("/", createShip);

router.get("/:id", getShip);

router.delete("/:id", deleteShip);

router.patch("/:id", updateShip);

module.exports = router;
