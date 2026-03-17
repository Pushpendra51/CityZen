const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { validateSignup } = require("../middleware/validationMiddleware");

const router = express.Router();

// Google Login
router.post("/google", async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, sub: googleId, picture } = ticket.getPayload();
    const email = ticket.getPayload().email.toLowerCase().trim();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, googleId, avatar: picture });
      await user.save();
    } else {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.avatar && picture) {
        user.avatar = picture;
        updated = true;
      }
      if (updated) await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Google authentication failed." });
  }
});

// Signup
router.post("/signup", validateSignup, async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed. Please try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email.toLowerCase().trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (!user.password) {
      return res.status(400).json({ 
        message: "This account was created via Google/Phone login. Please sign in with those methods or set a password." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// --- Phone Auth (Twilio & Simulation) ---
let otpStore = {}; // Memory-only OTP store (Simulation)

// Send OTP (Real SMS if configured, otherwise Simulation)
router.post("/phone/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[phone] = { otp, expires: Date.now() + 300000 }; // 5 mins

    // Try to load Twilio and send real SMS
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        const twilio = require("twilio");
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: `Your Smart City CMS verification code is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        });
        return res.json({ message: `A real verification code has been sent to ${phone}.` });
      } catch (twilioErr) {
        console.warn("Twilio not ready or failed:", twilioErr.message);
        // If it's a "Module Not Found" error, we just fall through to simulation
      }
    }

    // Fallback Simulation
    if (process.env.NODE_ENV === "development") {
      console.log(`[SIMULATION] OTP for ${phone}: ${otp}`);
    }
    res.json({ 
      message: `Verification code sent to ${phone}.${process.env.NODE_ENV === "development" ? ` (Simulated Code: ${otp})` : ""}`, 
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined 
    });
  } catch (error) {
    const fs = require('fs');
    fs.appendFileSync('debug.log', `[${new Date().toISOString()}] OTP Error: ${error.message}\n${error.stack}\n`);
    console.error("OTP Send Error:", error);
    res.status(500).json({ message: "Failed to send OTP.", error: error.message });
  }
});

// Verify OTP & Login/Register
router.post("/phone/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const stored = otpStore[phone];

    if (!stored || stored.otp !== otp || Date.now() > stored.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    delete otpStore[phone];

    let user = await User.findOne({ phone });
    if (!user) {
      // Create new user for phone social auth
      const baseName = `Citizen_${phone.slice(-4)}`;
      user = new User({ name: baseName, phone, email: `${phone}@smartcity.cms`, role: "user" });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed." });
  }
});
// --- End Phone Auth ---

// Get current user profile
router.get("/me", require("../middleware/auth").auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

module.exports = router;