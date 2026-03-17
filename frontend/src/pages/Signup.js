import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { GoogleLogin } from "@react-oauth/google";

function Signup() {
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/google", { tokenId: response.credential });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await api.post("/api/auth/signup", { name, email, password });
      navigate("/login", { state: { message: "Account created! Please sign in." } });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [authMode, setAuthMode] = useState("email"); // "email" or "phone"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(1);
  const [otpSentMsg, setOtpSentMsg] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/phone/send-otp", { phone });
      setOtpSentMsg(res.data.message);
      setOtpStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/phone/verify-otp", { phone, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: theme.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : theme.inputBg, border: `1px solid ${theme.inputBorder}`,
    borderRadius: "10px", padding: "0.75rem 1rem",
    color: theme.textPrimary, fontSize: "0.95rem",
    outline: "none", width: "100%", transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      background: theme.heroGradient,
      position: "relative", overflow: "hidden",
      transition: "background 0.3s",
    }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem 4rem" }}>
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: "500px", height: "400px",
          background: theme.glow, pointerEvents: "none",
        }} />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme.toggleLabel}
          style={{
            position: "absolute", top: "1.25rem", right: "1.25rem",
            background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
            borderRadius: "8px", padding: "0.35rem 0.75rem",
            cursor: "pointer", fontSize: "0.9rem",
            color: theme.textSecondary, fontWeight: "600",
            display: "flex", alignItems: "center", gap: "0.4rem",
            transition: "all 0.2s",
            zIndex: 10,
          }}
        >
          {theme.toggleIcon} {theme.toggleLabel}
        </button>

        <div style={{
          position: "relative",
          background: theme.cardBg, backdropFilter: "blur(20px)",
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: "24px", padding: "2.5rem 2rem",
          width: "100%", maxWidth: "420px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          transition: "background 0.3s, border-color 0.3s",
        }}>
          <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1rem" }}>🏙️</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: theme.textPrimary, textAlign: "center", marginBottom: "0.35rem" }}>
            {authMode === "email" ? "Create account" : "Phone Signup"}
          </h1>
          <p style={{ color: theme.textMuted, textAlign: "center", marginBottom: "1.75rem", fontSize: "0.9rem" }}>
            {authMode === "email" ? "Join the Smart City CMS platform today" : "Enter your mobile number to get started"}
          </p>

          {/* Mode Toggle */}
          <div style={{ 
            display: "flex", 
            background: "rgba(0,0,0,0.05)", 
            padding: "4px", 
            borderRadius: "12px", 
            marginBottom: "1.5rem" 
          }}>
            <button 
              onClick={() => { setAuthMode("email"); setError(""); }}
              style={{
                flex: 1, padding: "8px", border: "none", borderRadius: "8px", cursor: "pointer",
                background: authMode === "email" ? theme.cardBg : "transparent",
                color: authMode === "email" ? theme.textPrimary : theme.textSecondary,
                fontWeight: "700", fontSize: "0.85rem", transition: "all 0.2s"
              }}
            >Email</button>
            <button 
              onClick={() => { setAuthMode("phone"); setError(""); setOtpStep(1); }}
              style={{
                flex: 1, padding: "8px", border: "none", borderRadius: "8px", cursor: "pointer",
                background: authMode === "phone" ? theme.cardBg : "transparent",
                color: authMode === "phone" ? theme.textPrimary : theme.textSecondary,
                fontWeight: "700", fontSize: "0.85rem", transition: "all 0.2s"
              }}
            >Phone</button>
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444", borderRadius: "10px",
              padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.85rem",
            }}>
              {error}
            </div>
          )}

          {otpSentMsg && otpStep === 2 && !error && (
            <div style={{
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
              color: "#10b981", borderRadius: "10px",
              padding: "0.7rem 1rem", marginBottom: "1rem", fontSize: "0.85rem",
            }}>
              {otpSentMsg}
            </div>
          )}

          {authMode === "email" ? (
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { id: "signup-name", label: "Full Name", type: "text", ph: "John Doe", val: name, set: setName },
                { id: "signup-email", label: "Email", type: "email", ph: "you@example.com", val: email, set: setEmail },
                { id: "signup-password", label: "Password", type: "password", ph: "Min. 6 characters", val: password, set: setPassword },
              ].map(({ id, label, type, ph, val, set }) => (
                <div key={id} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ color: theme.textSecondary, fontSize: "0.85rem", fontWeight: "500" }}>{label}</label>
                  <input
                    id={id} type={type} placeholder={ph} value={val}
                    onChange={(e) => set(e.target.value)} required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
                  />
                </div>
              ))}
              <button
                id="signup-submit" type="submit" disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", border: "none", borderRadius: "12px",
                  padding: "0.85rem", fontWeight: "700", fontSize: "1rem",
                  cursor: "pointer", marginTop: "0.5rem",
                  boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {otpStep === 1 ? (
                <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ color: theme.textSecondary, fontSize: "0.85rem", fontWeight: "500" }}>Phone Number</label>
                    <input
                      type="tel" placeholder="9876543210"
                      value={phone} onChange={(e) => setPhone(e.target.value)} required
                      style={{
                        background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                        borderRadius: "10px", padding: "0.75rem 1rem",
                        color: theme.textPrimary, fontSize: "0.95rem", outline: "none",
                        width: "100%"
                      }}
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    style={{
                      background: theme.accentPurple, color: "#fff", border: "none", borderRadius: "12px",
                      padding: "0.85rem", fontWeight: "700", fontSize: "1rem", cursor: "pointer",
                      boxShadow: "0 8px 15px rgba(139, 92, 246, 0.3)"
                    }}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <label style={{ color: theme.textSecondary, fontSize: "0.85rem", fontWeight: "500" }}>Enter OTP</label>
                    <input
                      type="text" placeholder="123456" maxLength="6"
                      value={otp} onChange={(e) => setOtp(e.target.value)} required
                      style={{
                        background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                        borderRadius: "10px", padding: "0.75rem 1rem",
                        color: theme.textPrimary, fontSize: "1.25rem", textAlign: "center", letterSpacing: "8px", outline: "none",
                        width: "100%"
                      }}
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    style={{
                      background: "#10b981", color: "#fff", border: "none", borderRadius: "12px",
                      padding: "0.85rem", fontWeight: "700", fontSize: "1rem", cursor: "pointer",
                      boxShadow: "0 8px 15px rgba(16, 185, 129, 0.3)"
                    }}
                  >
                    {loading ? "Verifying..." : "Verify & Signup"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setOtpStep(1)}
                    style={{ background: "transparent", border: "none", color: theme.accentPurple, cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}
                  >
                    Change Phone Number
                  </button>
                </form>
              )}
            </div>
          )}

          <p style={{ color: theme.textFaint, fontSize: "0.75rem", textAlign: "center", marginTop: "1rem", lineHeight: "1.5" }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p style={{ color: theme.textMuted, textAlign: "center", marginTop: "0.75rem", fontSize: "0.88rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: theme.accentPurple, textDecoration: "none", fontWeight: "600" }}>Sign in</Link>
          </p>
          <p style={{ color: theme.textFaint, textAlign: "center", marginTop: "0.5rem", fontSize: "0.85rem" }}>
            <Link to="/" style={{ color: theme.textFaint, textDecoration: "none" }}>← Back to Home</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;