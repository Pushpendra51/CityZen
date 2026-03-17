import React from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapComponent from "../components/MapComponent";
import { useTheme } from "../context/ThemeContext";

function LandingPage() {
  const { theme } = useTheme();
  const [mapComplaints, setMapComplaints] = React.useState([]);

  React.useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await api.get("/api/complaint/map-data");
        setMapComplaints(res.data);
      } catch (err) {
        console.error("Error fetching map data:", err);
      }
    };
    fetchMapData();
  }, []);

  return (
    <div style={{ background: theme.pageBg, minHeight: "100vh", color: theme.textPrimary, transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{
        position: "relative",
        padding: "8rem 2rem 6rem",
        overflow: "hidden",
        background: theme.heroGradient,
        transition: "background 0.5s ease",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "800px", height: "800px",
          background: theme.glow,
          filter: "blur(80px)",
          pointerEvents: "none",
          opacity: 0.6,
        }} />

        <div style={{
          position: "relative",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4rem",
        }}>
          {/* Left: Text Content */}
          <div style={{ flex: "1 1 min(100%, 600px)", animation: "fadeIn 1s ease-out" }}>
            <div style={{
              display: "inline-block",
              background: theme.accentPurpleDim,
              border: `1px solid ${theme.accentPurpleBorder}`,
              color: theme.accentPurple,
              borderRadius: "999px",
              padding: "0.5rem 1.5rem",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginBottom: "2rem",
              boxShadow: theme.shadow,
            }}>
              🏙️ Smart City Initiative
            </div>
            <h1 style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: "900", lineHeight: "1.1", marginBottom: "1.5rem", color: theme.textPrimary, letterSpacing: "-0.02em" }}>
              Voice Your City<br />
              <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "0 10px 30px rgba(99,102,241,0.2)" }}>
                Complaints, Fixed.
              </span>
            </h1>
            <p style={{ fontSize: "1.25rem", color: theme.textSecondary, lineHeight: "1.6", marginBottom: "3rem", maxWidth: "600px" }}>
              A state-of-the-art platform for reporting urban issues. From potholes to lighting, we bridge the gap between citizens and solutions.
            </p>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "4rem" }}>
              <Link to="/signup" style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", textDecoration: "none",
                padding: "1rem 2.5rem", borderRadius: "14px",
                fontWeight: "700", fontSize: "1.1rem",
                boxShadow: "0 10px 40px rgba(99,102,241,0.5)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }} onMouseOver={e => {e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 15px 50px rgba(99,102,241,0.6)"}} onMouseOut={e => {e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 10px 40px rgba(99,102,241,0.5)"}}>
                Get Started
              </Link>
              <Link to="/login" style={{
                display: "inline-block",
                border: `1px solid ${theme.cardBorder}`,
                color: theme.textPrimary, textDecoration: "none",
                padding: "1rem 2.5rem", borderRadius: "14px",
                fontWeight: "600", fontSize: "1.1rem",
                background: theme.cardBg,
                backdropFilter: "blur(12px)",
                transition: "all 0.3s",
                boxShadow: theme.shadow,
              }}>
                Sign In
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap" }}>
              {[["500+", "Resolved"], ["10+", "Zones"], ["24/7", "Active"]].map(([val, label], i) => (
                <React.Fragment key={label}>
                  {i > 0 && <div style={{ width: "1px", height: "40px", background: theme.cardBorder }} />}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <strong style={{ color: theme.textPrimary, fontSize: "1.5rem", fontWeight: "800" }}>{val}</strong>
                    <span style={{ color: theme.textMuted, fontSize: "0.9rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: Dashboard Animation */}
          <div style={{ flex: "1 1 500px", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "550px",
              height: "400px",
              background: `linear-gradient(135deg, ${theme.cardBg}, rgba(139, 92, 246, 0.05))`,
              border: `1px solid ${theme.accentPurpleBorder}`,
              borderRadius: "32px",
              backdropFilter: "blur(24px)",
              boxShadow: "0 20px 80px rgba(99, 102, 241, 0.15)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              overflow: "hidden"
            }}>
              {/* Dashboard Header UI Mock */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", opacity: 0.8 }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}/>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}/>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}/>
                </div>
                <div style={{ height: "8px", width: "40%", background: theme.rowBorder, borderRadius: "4px" }}/>
              </div>

              {/* Animated Complaint Cards */}
              {[
                { icon: "🚧", title: "Pothole on Main St.", status: "In Progress", color: "#f59e0b", delay: "0s" },
                { icon: "💡", title: "Broken Streetlight", status: "Resolved", color: "#10b981", delay: "1.2s" },
                { icon: "🗑️", title: "Uncollected Trash", status: "Pending", color: "#ef4444", delay: "2.5s" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: theme.pageBg,
                  borderRadius: "16px",
                  padding: "1rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  animation: `float-card 6s ease-in-out infinite`,
                  animationDelay: item.delay,
                  border: `1px solid ${theme.cardBorder}`
                }}>
                  <div style={{ fontSize: "2rem", background: `${item.color}15`, padding: "0.5rem", borderRadius: "12px" }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", color: theme.textPrimary, marginBottom: "0.25rem" }}>{item.title}</div>
                    <div style={{ fontSize: "0.85rem", color: theme.textSecondary }}>Zone {i + 1}</div>
                  </div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "600", color: item.color, background: `${item.color}15`, padding: "0.3rem 0.8rem", borderRadius: "99px" }}>
                    {item.status}
                  </div>
                </div>
              ))}
              
              {/* Decorative map blur overlay at bottom */}
               <div style={{
                  position: "absolute", bottom: "-20%", right: "-10%",
                  width: "250px", height: "250px",
                  background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(255,255,255,0) 70%)",
                  filter: "blur(40px)", pointerEvents: "none"
               }}/>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "8rem 2rem", background: theme.pageBg, textAlign: "center", transition: "all 0.3s" }}>
        <h2 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "1rem", color: theme.textPrimary, letterSpacing: "-0.01em" }}>Why Choose Smart City CMS?</h2>
        <p style={{ color: theme.textSecondary, marginBottom: "4rem", fontSize: "1.15rem", maxWidth: "600px", margin: "0 auto 4rem" }}>Next-generation tools built for a more responsive and efficient urban life.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          {featureList.map((f, i) => (
            <div key={i} style={{
              background: theme.featureCardBg,
              border: `1px solid ${theme.featureCardBorder}`,
              borderRadius: "24px",
              padding: "2.5rem",
              textAlign: "left",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s",
              backdropFilter: "blur(12px)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(99, 102, 241, 0.15)";
              e.currentTarget.style.borderColor = theme.accentPurple;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = theme.featureCardBorder;
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem", filter: "drop-shadow(0 0 10px rgba(99,102,241,0.3))" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "0.75rem", color: theme.textPrimary }}>{f.title}</h3>
              <p style={{ color: theme.textSecondary, lineHeight: "1.7", fontSize: "1rem" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "8rem 2rem", background: theme.heroGradient, textAlign: "center", transition: "all 0.3s" }}>
        <h2 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "4rem", color: theme.textPrimary }}>Execution Flow</h2>
        <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap", maxWidth: "1200px", margin: "0 auto" }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{
                flex: "1", minWidth: "250px",
                background: theme.stepCardBg,
                border: `1px solid ${theme.stepCardBorder}`,
                borderRadius: "24px", padding: "3rem 2rem",
                transition: "all 0.3s",
                backdropFilter: "blur(10px)",
                boxShadow: theme.shadow,
              }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "18px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  fontWeight: "900", fontSize: "1.25rem", color: "#fff",
                  boxShadow: "0 8px 25px rgba(99,102,241,0.5)",
                }}>
                  0{i + 1}
                </div>
                <h3 style={{ fontWeight: "800", marginBottom: "0.75rem", color: theme.textPrimary, fontSize: "1.2rem" }}>{s.title}</h3>
                <p style={{ color: theme.textSecondary, fontSize: "1rem", lineHeight: "1.6" }}>{s.desc}</p>
              </div>
              
              {/* Arrow Icon between steps */}
              {i < steps.length - 1 && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: theme.textMuted, opacity: 0.6,
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

        {/* Map Monitoring Section */}
        <section style={{ maxWidth: "1200px", margin: "8rem auto", padding: "0 2rem", animation: "fadeInUp 0.8s ease-out" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ color: theme.accentPurple, fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.9rem" }}>Real-time Visualization</span>
            <h2 style={{ fontSize: "3rem", fontWeight: "900", marginTop: "1rem", color: theme.textPrimary }}>City-Wide <span style={{ background: theme.accentPurple, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Monitoring</span></h2>
            <p style={{ color: theme.textSecondary, fontSize: "1.1rem", maxWidth: "600px", margin: "1.5rem auto" }}>
              Our interactive map shows unresolved issues across all zones, ensuring complete transparency and accountability in city management.
            </p>
          </div>
          <div style={{
            background: theme.cardBg,
            backdropFilter: "blur(16px)",
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: "32px",
            padding: "1rem",
            boxShadow: theme.shadow
          }}>
            <MapComponent complaints={mapComplaints} height="500px" />
          </div>
        </section>

        {/* CTA */}
      <section style={{ padding: "10rem 2rem", textAlign: "center", background: theme.pageBg, transition: "all 0.3s" }}>
        <div style={{
          maxWidth: "900px", margin: "0 auto",
          background: theme.heroGradient,
          padding: "5rem 2rem", borderRadius: "40px",
          border: `1px solid ${theme.cardBorder}`,
          boxShadow: theme.shadow,
          backdropFilter: "blur(20px)",
        }}>
          <h2 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "1.5rem", color: theme.textPrimary, letterSpacing: "-0.01em" }}>Transform Your City.</h2>
          <p style={{ color: theme.textSecondary, marginBottom: "3rem", fontSize: "1.25rem" }}>Join the movement for smarter, cleaner, and better managed urban spaces.</p>
          <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
            <Link to="/signup" style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", textDecoration: "none",
              padding: "1.2rem 3rem", borderRadius: "16px",
              fontWeight: "800", fontSize: "1.1rem",
              boxShadow: "0 10px 40px rgba(99,102,241,0.5)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }} onMouseOver={e => {e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 15px 50px rgba(99,102,241,0.6)"}} onMouseOut={e => {e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 10px 40px rgba(99,102,241,0.5)"}}>
              Get Started
            </Link>
            <Link to="/dashboard" style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.1)",
              border: `1px solid rgba(255, 255, 255, 0.2)`,
              color: theme.textPrimary, textDecoration: "none",
              padding: "1.2rem 3rem", borderRadius: "16px",
              fontWeight: "800", fontSize: "1.1rem",
              backdropFilter: "blur(12px)",
              transition: "all 0.3s",
            }} onMouseOver={e => {e.target.style.background = "rgba(255, 255, 255, 0.2)"; e.target.style.transform = "translateY(-2px)"}} onMouseOut={e => {e.target.style.background = "rgba(255, 255, 255, 0.1)"; e.target.style.transform = "translateY(0)"}}>
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-card {
          0% { transform: translateY(0px); box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          50% { transform: translateY(-12px); box-shadow: 0 20px 40px rgba(0,0,0,0.12); }
          100% { transform: translateY(0px); box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        }
      `}</style>
    </div>
  );
};

const featureList = [
  { icon: "📍", title: "Zone-Based Reporting", desc: "Tag your complaint to the exact zone so the right authority gets notified immediately." },
  { icon: "⚡", title: "Priority Scoring", desc: "Our AI-powered urgency scoring ensures the most critical issues are resolved first." },
  { icon: "📊", title: "Real-Time Tracking", desc: "Track the status of every complaint you submit with live status updates." },
  { icon: "🔒", title: "Secure & Private", desc: "Your data is encrypted and protected. JWT authentication keeps your account safe." },
  { icon: "🛠️", title: "Admin Dashboard", desc: "City officials get a dedicated panel to manage, resolve, and prioritize complaints." },
  { icon: "📱", title: "Mobile Friendly", desc: "Fully responsive design works seamlessly on any device, anywhere, anytime." },
];

const steps = [
  { title: "Create Account", desc: "Sign up in seconds with your name, email, and password." },
  { title: "Submit Complaint", desc: "Fill in your zone, type of issue, urgency level, and a description." },
  { title: "Track Progress", desc: "Monitor your complaint status from Pending → In Progress → Resolved." },
];

export default LandingPage;
