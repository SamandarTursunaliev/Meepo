const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Destination = mongoose.model("Destination", destinationSchema);

module.exports = Destination;