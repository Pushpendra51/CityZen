import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const AboutUs = () => {
  const { theme } = useTheme();

  const cardStyle = {
    background: theme.cardBg,
    backdropFilter: "blur(16px)",
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "32px",
    padding: "3rem",
    boxShadow: theme.shadow,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <div style={{ background: theme.pageBg, minHeight: "100vh", color: theme.textPrimary, transition: "all 0.4s ease" }}>
      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "6rem 2rem" }}>
        {/* Hero Section */}
        <section style={{ textAlign: "center", marginBottom: "6rem", animation: "fadeIn 0.8s ease-out" }}>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "900", color: theme.textPrimary, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            The Vision of <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Smart City CMS</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: theme.textSecondary, maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
            The <strong>Smart City Complaint Management System</strong> (CityZen) is a cutting-edge platform designed to bridge the gap between citizens and administration,
            empowering everyone to contribute to a better, more responsive urban environment.
          </p>
        </section>

        {/* Vision & Mission */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2.5rem", marginBottom: "6rem" }}>
          {[
            { icon: "🚀", title: "Our Vision", desc: "To transform every city into a truly 'Smart City' where technology serves as a transparent conduit for citizen needs, ensuring no issue goes unheard and no problem stays unsolved." },
            { icon: "🎯", title: "Our Mission", desc: "We provide an intuitive, high-performance portal for reporting urban issues—from infrastructure damage to sanitation needs—facilitating rapid resolution through intelligent administration dashboards." }
          ].map((c, i) => (
            <div key={i} style={{ ...cardStyle, overflow: "hidden", position: "relative" }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(99, 102, 241, 0.15)";
                e.currentTarget.style.borderColor = theme.accentPurple;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = theme.shadow;
                e.currentTarget.style.borderColor = theme.cardBorder;
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>{c.icon}</div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "1rem" }}>{c.title}</h2>
              <p style={{ color: theme.textSecondary, lineHeight: "1.7", fontSize: "1.1rem" }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Us? */}
        <section style={{ ...cardStyle, textAlign: "center", background: theme.heroGradient }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "900", marginBottom: "3rem" }}>Why Choose Smart City CMS</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem" }}>
            {[
              { label: "Transparency", icon: "💎", desc: "Track every report in real-time." },
              { label: "Efficiency", icon: "⚡", desc: "Automated routing to right officials." },
              { label: "Accountability", icon: "🤝", desc: "Direct feedback on resolution quality." },
              { label: "Modernity", icon: "✨", desc: "Next-gen UI for next-gen cities." }
            ].map((f, i) => (
              <div key={i} style={{ transition: "all 0.3s" }}
                onMouseOver={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "0.5rem" }}>{f.label}</h3>
                <p style={{ color: theme.textSecondary, fontSize: "0.95rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
