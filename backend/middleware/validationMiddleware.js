const validateComplaint = (req, res, next) => {
  const { name, zone, category, type, urgency, description } = req.body;

  if (!name || !zone || !category || !type || !urgency || !description) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  const urgencyNum = parseInt(urgency);
  if (isNaN(urgencyNum) || urgencyNum < 1 || urgencyNum > 10) {
    return res.status(400).json({ message: "Urgency must be a number between 1 and 10." });
  }

  next();
};

const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }
  next();
};

module.exports = { validateComplaint, validateSignup };
