import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const Footer = () => {
  const { theme } = useTheme();
  
  const linkStyle = {
    color: theme.textSecondary,
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
    fontWeight: "500",
  };

  const sectionTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: "800",
    marginBottom: "1.5rem",
    color: theme.textPrimary,
    letterSpacing: "-0.01em",
  };

  return (
    <footer style={{
      background: theme.navBg,
      backdropFilter: "blur(24px)",
      borderTop: `1px solid ${theme.navBorder}`,
      padding: "6rem 2rem 3rem",
      color: theme.textPrimary,
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "4rem",
        marginBottom: "5rem"
      }}>
        {/* Brand & Mission */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <img src={process.env.PUBLIC_URL + "/logo.png"} alt="Logo" style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "50%" }} />
              <span style={{ fontSize: "2rem", fontWeight: "900", letterSpacing: "-0.03em", color: theme.textPrimary }}>Smart City <span style={{ color: theme.accentPurple }}>CMS</span></span>
            </div>
            <p style={{ color: theme.textSecondary, fontSize: "1.05rem", lineHeight: "1.6", maxWidth: "320px" }}>
              Empowering urban communities with cutting-edge technology to create a more responsive, efficient, and better managed city for all.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: theme.textSecondary, fontSize: "0.95rem" }}>
              <span style={{ opacity: 0.7 }}>📧</span>
              <span>support@smartcitycms.com</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 style={sectionTitleStyle}>Navigation</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li><Link to="/" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>Home Overview</Link></li>
            <li><Link to="/about" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>About Our Vision</Link></li>
            <li><Link to="/dashboard" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>Citizen Dashboard</Link></li>
            <li><Link to="/admin" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>Admin Control Panel</Link></li>
            <li><Link to="/signup" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>Public Registration</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 style={sectionTitleStyle}>Resources</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <li><a href="mailto:support@smartcitycms.com" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>24/7 Support Center</a></li>
            <li><a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>Status Monitoring</a></li>
            <li><a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>API Documentation</a></li>
            <li><a href="#" style={linkStyle} onMouseOver={e => e.target.style.color = theme.accentPurple} onMouseOut={e => e.target.style.color = theme.textSecondary}>System Governance</a></li>
          </ul>
        </div>

        {/* Social & Connect */}
        <div>
          <h4 style={sectionTitleStyle}>Connect</h4>
          <p style={{ color: theme.textSecondary, fontSize: "0.95rem", marginBottom: "1.5rem" }}>Follow our journey towards a smarter urban landscape.</p>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            {[
              { icon: <XIcon />, title: "Twitter (X)", link: "https://x.com/pxshpendra" },
              { icon: <LinkedInIcon />, title: "LinkedIn", link: "https://www.linkedin.com/in/pushpendra61/" },
              { icon: <GithubIcon />, title: "GitHub", link: "https://github.com/Pushpendra51" }
            ].map((soc, i) => (
              <a 
                key={i} 
                href={soc.link} 
                title={soc.title}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem", textDecoration: "none", color: theme.textSecondary,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = theme.accentPurple;
                  e.currentTarget.style.color = theme.accentPurple;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = theme.cardBorder;
                  e.currentTarget.style.color = theme.textSecondary;
                }}
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        paddingTop: "2.5rem",
        borderTop: `1px solid ${theme.rowBorder}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "2rem",
        color: theme.textMuted,
        fontSize: "0.9rem"
      }}>
        <p style={{ fontWeight: "500" }}>© 2026 Smart City Complaint Management System | Developed by Pushpendra</p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <a href="#" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = theme.textSecondary} onMouseOut={e => e.target.style.color = "inherit"}>Privacy Policy</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = theme.textSecondary} onMouseOut={e => e.target.style.color = "inherit"}>Terms of Service</a>
          <a href="#" style={{ color: "inherit", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = theme.textSecondary} onMouseOut={e => e.target.style.color = "inherit"}>Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
