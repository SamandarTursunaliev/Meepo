const mongoose = require("mongoose");

// Define the Job schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number },
  experience: { type: Number }, 
  skills: [{ type: String }], 
  jobType: { type: String, enum: ["remote", "hybrid", "onsite"], required: true },
  postedAt: { type: Date, default: Date.now },
});


jobSchema.index({ title: "text", description: "text", company: "text", skills: "text" });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;