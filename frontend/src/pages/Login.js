import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const { theme, toggleTheme } = useTheme();
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
      setError("Google Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [authMode, setAuthMode] = useState("email"); // "email" or "phone"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(1); // 1 = input phone, 2 = input otp
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
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      background: theme.heroGradient,
      position: "relative", overflow: "hidden",
      transition: "background 0.3s",
    }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 2rem 4rem" }}>
        {/* Glow */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "500px", height: "300px",
          background: theme.glow, pointerEvents: "none",
        }} />

        {/* Theme toggle — top right */}
        <button
          onClick={toggleTheme}
          title={theme.toggleLabel}
          style={{
            position: "absolute", top: "1.25rem", right: "1.25rem",
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
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
          background: theme.cardBg,
          backdropFilter: "blur(20px)",
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: "24px", padding: "2.5rem 2rem",
          width: "100%", maxWidth: "420px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          transition: "background 0.3s, border-color 0.3s",
        }}>
          <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "1rem" }}>🏙️</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: theme.textPrimary, textAlign: "center", marginBottom: "0.35rem" }}>
            {authMode === "email" ? "Welcome back" : "Phone Login"}
          </h1>
          <p style={{ color: theme.textMuted, textAlign: "center", marginBottom: "1.75rem", fontSize: "0.9rem" }}>
            {authMode === "email" ? "Sign in to your Smart City CMS account" : "Enter your mobile number to get started"}
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
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ color: theme.textSecondary, fontSize: "0.85rem", fontWeight: "500" }}>Email</label>
                <input
                  id="login-email" type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  style={{
                    background: theme.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                    borderRadius: "10px", padding: "0.75rem 1rem",
                    color: theme.textPrimary, fontSize: "0.95rem", outline: "none",
                    width: "100%", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ color: theme.textSecondary, fontSize: "0.85rem", fontWeight: "500" }}>Password</label>
                <input
                  id="login-password" type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  style={{
                    background: theme.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                    borderRadius: "10px", padding: "0.75rem 1rem",
                    color: theme.textPrimary, fontSize: "0.95rem", outline: "none",
                    width: "100%", transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = theme.inputBorder)}
                />
              </div>
              <button
                id="login-submit" type="submit" disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", border: "none", borderRadius: "12px",
                  padding: "0.85rem", fontWeight: "700", fontSize: "1rem",
                  cursor: "pointer", marginTop: "0.5rem",
                  boxShadow: "0 8px 25px rgba(99,102,241,0.4)",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
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
                        background: theme.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : theme.inputBg, border: `1px solid ${theme.inputBorder}`,
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
                        background: theme.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : theme.inputBg, border: `1px solid ${theme.inputBorder}`,
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
                    {loading ? "Verifying..." : "Verify & Login"}
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

{/* 
          <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", background: theme.navBorder }}></div>
            <span style={{ color: theme.textMuted, fontSize: "0.8rem", fontWeight: "600" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: theme.navBorder }}></div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign-In was unsuccessful.")}
              useOneTap
              theme={theme.mode === "dark" ? "filled_black" : "outline"}
              shape="pill"
              text="signin_with"
            />
          </div>
          */}

          <p style={{ color: theme.textMuted, textAlign: "center", marginTop: "1.25rem", fontSize: "0.88rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: theme.accentPurple, textDecoration: "none", fontWeight: "600" }}>Sign up</Link>
          </p>
          <p style={{ color: theme.textFaint, textAlign: "center", marginTop: "0.75rem", fontSize: "0.85rem" }}>
            <Link to="/" style={{ color: theme.textFaint, textDecoration: "none" }}>← Back to Home</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;