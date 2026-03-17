const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: { type: String, required: true },
    zone: { type: String, required: true },
    category: { type: String, required: true, default: "General" },
    type: { type: String, required: true },
    urgency: { type: Number, min: 1, max: 10, required: true },
    description: { type: String, required: true },
    location: { type: String, required: false },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    priority: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    imageUrl: { type: String, required: false },
    supporters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: { type: Number, min: 1, max: 5, required: false },
    feedback: { type: String, required: false },
  },
  { timestamps: true }
);

ComplaintSchema.index({ userId: 1 });

// Auto-compute priority from urgency before saving
ComplaintSchema.pre("save", async function () {
  this.priority = this.urgency;
});

module.exports = mongoose.model("Complaint", ComplaintSchema);