const express = require("express");

const {
  createContract,
  getContracts,
  getContract,
  deleteContract,
  updateContract,
} = require("../controllers/contracts.js");

const router = express.Router();

router.get("/", getContracts);

router.post("/", createContract);

router.get("/:id", getContract);

router.delete("/:id", deleteContract);

router.patch("/:id", updateContract);

module.exports = router;
