const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

//  POST a new job
router.post("/jobs", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("❌ Error adding job:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//  GET all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs
    res.json(jobs);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;