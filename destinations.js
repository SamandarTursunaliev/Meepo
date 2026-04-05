const express = require("express");
const Destination = require("../models/Destination"); // Import Destination model

const router = express.Router();

// Route to add a new destination
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const destination = new Destination({ name });
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to get all destinations
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;