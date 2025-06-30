const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const qaSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "General", "User", "Listings", "Reviews", "Bookings",
      "Technical", "AboutCreator", "EdgeCases",
    ],
    required: true,
  },
});

qaSchema.index({ question: 'text' });

module.exports = mongoose.model("QA", qaSchema);
