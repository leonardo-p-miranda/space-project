const express = require("express");

const {
  createPilot,
  getPilots,
  getPilot,
  deletePilot,
  travelBetweenPlanets,
  updatePilot,
  refillFuel,
  acceptContract,
} = require("../controllers/pilots.js");

const router = express.Router();

router.get("/", getPilots);

router.post("/", createPilot);

router.get("/:id", getPilot);

router.delete("/:id", deletePilot);

router.put("/:id", updatePilot);

router.patch("/:id/travel/:newLocation", travelBetweenPlanets);

router.patch("/fuel/:id", refillFuel);

router.patch("/accept-contract/:id/:contract", acceptContract);

module.exports = router;
