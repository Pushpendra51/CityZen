/**
 * Simple Keyword-based AI Categorization Service
 * Can be easily extended to use Gemini/OpenAI API
 */

const categories = [
  "Infrastructure", "Electricity", "Sanitation", "Water", "Public Safety", "Environment", "Transport", "Other"
];

const keywords = {
  Infrastructure: ["road", "pothole", "bridge", "building", "construction", "crack", "pavement"],
  Electricity: ["power", "light", "electricity", "outage", "wire", "transformer", "spark"],
  Sanitation: ["garbage", "trash", "waste", "drain", "sewage", "clean", "smell", "stink"],
  Water: ["leak", "pipe", "water", "flow", "burst", "supply", "tap"],
  "Public Safety": ["police", "crime", "theft", "safety", "threat", "danger", "harassment", "dark"],
  Environment: ["tree", "park", "pollution", "smoke", "garden", "air", "noise"],
  Transport: ["bus", "traffic", "parking", "signal", "transport", "metro", "roadblock"]
};

const typeMapping = {
  road: "Pothole / Road Damage",
  pothole: "Pothole / Road Damage",
  light: "Street Lighting",
  power: "Street Lighting",
  garbage: "Garbage Collection",
  trash: "Garbage Collection",
  water: "Water Supply",
  leak: "Water Supply",
  drain: "Drainage / Flooding",
  noise: "Noise Pollution",
  construction: "Illegal Construction",
  safety: "Public Safety",
  park: "Park / Recreation"
};

exports.analyzeComplaint = async (text) => {
  const lowerText = text.toLowerCase();
  let detectedCategory = "Other";
  let detectedType = "Other";
  let urgencyScore = 3;

  // 1. Detect Category
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerText.includes(word))) {
      detectedCategory = category;
      break;
    }
  }

  // 2. Detect Type
  for (const [word, type] of Object.entries(typeMapping)) {
    if (lowerText.includes(word)) {
      detectedType = type;
      break;
    }
  }

  // 3. Estimate Urgency
  const highUrgencyWords = ["danger", "emergency", "urgent", "broken", "burst", "outage", "spark", "accident", "risk", "hurt"];
  const mediumUrgencyWords = ["bad", "problem", "leak", "smell", "dark", "noise"];

  if (highUrgencyWords.some(word => lowerText.includes(word))) {
    urgencyScore = 8;
  } else if (mediumUrgencyWords.some(word => lowerText.includes(word))) {
    urgencyScore = 5;
  }

  return {
    category: detectedCategory,
    type: detectedType,
    urgency: urgencyScore
  };
};
