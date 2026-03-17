import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 2rem",
      height: "64px",
      background: theme.navBg,
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${theme.navBorder}`,
      position: "sticky",
      top: 0,
      zIndex: 1000,
      transition: "background 0.3s, border-color 0.3s",
    }}>
      {/* Brand */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Logo" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "50%" }} />
        <span style={{ fontSize: "1.5rem", fontWeight: "800", color: theme.textPrimary, letterSpacing: "-0.5px" }}>
          Smart City <span style={{ color: theme.accentPurple }}>CMS</span>
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {/* Main Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginRight: "1rem" }}>
          <Link to="/" style={{ 
            color: theme.textSecondary, 
            textDecoration: "none", 
            fontSize: "0.9rem", 
            fontWeight: "600",
            transition: "color 0.2s" 
          }} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>
            Home
          </Link>
          <Link to="/about" style={{ 
            color: theme.textSecondary, 
            textDecoration: "none", 
            fontSize: "0.9rem", 
            fontWeight: "600",
            transition: "color 0.2s" 
          }} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>
            About Us
          </Link>
          {token && (
            <Link to="/dashboard" style={{ 
              color: theme.textSecondary, 
              textDecoration: "none", 
              fontSize: "0.9rem", 
              fontWeight: "600",
              transition: "color 0.2s" 
            }} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>
              Dashboard
            </Link>
          )}
          {user.role === "admin" && (
            <>
              <Link to="/admin" style={{ 
                color: theme.textSecondary, 
                textDecoration: "none", 
                fontSize: "0.9rem", 
                fontWeight: "600",
                transition: "color 0.2s" 
              }} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>
                Complaints
              </Link>
              <Link to="/analytics" style={{ 
                color: theme.textSecondary, 
                textDecoration: "none", 
                fontSize: "0.9rem", 
                fontWeight: "600",
                transition: "color 0.2s" 
              }} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>
                Analytics
              </Link>
            </>
          )}
          <a href="mailto:support@smartcitycms.com" style={{ 
            color: theme.textSecondary, 
            textDecoration: "none", 
            fontSize: "0.9rem", 
            fontWeight: "600",
            transition: "color 0.2s" 
          }} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>
            Support
          </a>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme.toggleLabel}
          style={{
            background: theme.toggleBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.textSecondary,
            transition: "all 0.3s ease",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
          onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {theme.toggleIcon}
        </button>

        <div style={{ height: "24px", width: "1px", background: theme.navBorder, margin: "0 0.5rem" }}></div>

        {token ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ 
              color: theme.textMuted, 
              fontSize: "0.85rem", 
              fontWeight: "600", 
              background: "rgba(0,0,0,0.05)", 
              padding: user.avatar ? "2px 10px 2px 4px" : "4px 10px", 
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover", border: `1px solid ${theme.accentPurpleBorder}` }} 
                />
              ) : "👤"} {user.name?.split(' ')[0] || "User"}
            </span>
            <button
              onClick={handleLogout}
              style={{
                color: "#ef4444",
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "8px",
                padding: "0.45rem 1rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "700",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.target.style.background = "#ef4444"; e.target.style.color = "#fff"; }}
              onMouseOut={e => { e.target.style.background = "rgba(239,68,68,0.05)"; e.target.style.color = "#ef4444"; }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/login" style={{ 
              color: theme.textSecondary, 
              textDecoration: "none", 
              fontSize: "0.9rem", 
              fontWeight: "600",
              transition: "color 0.2s"
            }} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>
              Login
            </Link>
            <Link to="/signup" style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "700",
              padding: "0.5rem 1.25rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              transition: "all 0.2s",
            }} onMouseOver={e => e.target.style.transform = "translateY(-1px)"} onMouseOut={e => e.target.style.transform = "translateY(0)"}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
