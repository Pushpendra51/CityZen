const express = require("express");
const router = express.Router();
const Complaint = require("../models/complaint");
const aiService = require("../services/aiService");
const { auth, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

// POST complaint
router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        const { name, zone, category, type, urgency, description, location, latitude, longitude } = req.body;
        
        const complaintData = {
            userId: req.user.id,
            name,
            zone,
            category,
            type,
            urgency,
            description,
            location,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        };

        const complaint = new Complaint(complaintData);
        await complaint.save();
      
        res.json({ message: "Complaint submitted successfully", complaint });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST analyze description
router.post("/analyze", async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }
        const result = await aiService.analyzeComplaint(description);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all complaints
router.get("/", async (req, res) => {
    try {
        const complaints = await Complaint.find().populate("userId", "name avatar");
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET my complaints
router.get("/my", auth, async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET map data (all complaints)
router.get("/map-data", async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// GET complaints sorted by priority
router.get("/priority", auth, adminOnly, async (req, res) => {
    try {

        const complaints = await Complaint.find().sort({ priority: -1 });

        res.json(complaints);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }
});
// Resolve complaint
router.put("/resolve/:id", auth, adminOnly, async (req, res) => {

  try {

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );

    res.json({
      message: "Complaint resolved successfully",
      complaint
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});
// Delete complaint
router.delete("/:id", auth, adminOnly, async (req, res) => {

  try {

    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Complaint deleted successfully",
      complaint
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});
module.exports = router;