const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const destinationRoutes = require("./routes/destinations");
const jobRoutes = require("./routes/jobRoutes");
const languageRoutes = require("./routes/languageRoutes"); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/destinations", destinationRoutes);
app.use("/api", jobRoutes);
app.use("/api/language", languageRoutes); 

// MongoDB connection process
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));