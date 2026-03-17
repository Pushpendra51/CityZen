import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const statusColors = {
  Pending: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", border: "rgba(245,158,11,0.3)" },
  "In Progress": { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  Resolved: { bg: "rgba(16,185,129,0.15)", text: "#34d399", border: "rgba(16,185,129,0.3)" },
};

function AdminDashboard() {
  const { theme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/api/complaint");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role !== "admin") { window.location.href = "/dashboard"; return; }
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/complaint/status/${id}`, { status });
      toast.success(`Status updated to "${status}"`);
      fetchComplaints();
    } catch (err) { toast.error("Failed to update status."); }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await api.delete(`/api/complaint/${id}`);
      toast.success("Complaint deleted.");
      fetchComplaints();
    } catch (err) { toast.error("Failed to delete complaint."); }
  };

  const filtered = complaints
    .filter((c) => filter === "All" || c.status === filter)
    .filter((c) =>
      !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.zone?.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase()) ||
      c.type?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase())
    );

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const cardStyle = {
    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
    borderRadius: "24px", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(12px)",
    boxShadow: theme.shadow,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: theme.pageBg, minHeight: "100vh", color: theme.textPrimary, transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      <Navbar />
      <div style={{ flex: 1, width: "100%", maxWidth: "1600px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem", animation: "fadeIn 0.6s ease-out" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: theme.textPrimary, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
            🛠️ Admin Control Panel
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user.avatar && (
              <img 
                src={user.avatar} 
                alt={user.name} 
                style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${theme.cardBorder}` }} 
              />
            )}
            Logged in as <strong style={{ color: "#f59e0b" }}>{user.name}</strong> <span style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", padding: "2px 8px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "700", marginLeft: "8px", border: "1px solid rgba(245,158,11,0.2)" }}>ADMIN</span>
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem", animation: "fadeIn 0.8s ease-out" }}>
          {[
            { label: "Total Assignments", value: total, color: theme.accentPurple, icon: "📋" },
            { label: "Awaiting Action", value: pending, color: "#fbbf24", icon: "⏳" },
            { label: "Active Repair", value: inProgress, color: "#60a5fa", icon: "🛠️" },
            { label: "System Resolved", value: resolved, color: "#10b981", icon: "✅" },
          ].map((s) => (
            <div key={s.label} style={{ ...cardStyle, padding: "1.75rem", display: "flex", flexDirection: "row", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ fontSize: "2.5rem", background: "rgba(0,0,0,0.05)", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "2.2rem", fontWeight: "900", color: s.color, lineHeight: "1" }}>{s.value}</span>
                <span style={{ color: theme.textSecondary, fontSize: "0.95rem", fontWeight: "600", marginTop: "0.25rem" }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", animation: "fadeIn 1s ease-out" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", background: theme.cardBg, padding: "0.5rem", borderRadius: "14px", border: `1px solid ${theme.cardBorder}` }}>
            {["All", "Pending", "In Progress", "Resolved"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "0.6rem 1.25rem", borderRadius: "10px", cursor: "pointer",
                fontSize: "0.9rem", fontWeight: "700", transition: "all 0.2s",
                background: filter === f ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                color: filter === f ? "#fff" : theme.textSecondary,
                border: "none",
                boxShadow: filter === f ? "0 4px 15px rgba(99,102,241,0.3)" : "none",
              }}>
                {f}
              </button>
            ))}
          </div>
          <div style={{ position: "relative", marginLeft: "auto", minWidth: "350px" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>🔍</span>
            <input
              placeholder="Search by citizen, zone, type or category…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
                borderRadius: "14px", padding: "0.8rem 1rem 0.8rem 2.8rem",
                color: theme.textPrimary, fontSize: "0.95rem", outline: "none",
                fontFamily: "inherit", transition: "all 0.2s",
              }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div style={{ ...cardStyle, padding: "0", overflow: "hidden", animation: "fadeIn 1.2s ease-out" }}>
          {loading ? (
            <div style={{ color: theme.textSecondary, textAlign: "center", padding: "6rem 0", fontSize: "1.1rem" }}>Syncing with central database…</div>
          ) : filtered.length === 0 ? (
            <div style={{ color: theme.textSecondary, textAlign: "center", padding: "6rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ fontSize: "5rem", opacity: 0.5 }}>📭</div>
              <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>No complaints matches the current criteria.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: theme.tableHeadBg }}>
                    {["Citizen", "Category / Type", "Location (Zone)", "Urgency", "Support", "Status", "Reported", "Actions"].map((h) => (
                      <th key={h} style={{
                        padding: "1.25rem 1.5rem", textAlign: "left",
                        fontSize: "0.85rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em",
                        color: theme.textMuted,
                        borderBottom: `1px solid ${theme.cardBorder}`,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const sc = statusColors[c.status] || statusColors.Pending;
                    return (
                      <tr key={c._id} style={{ borderBottom: `1px solid ${theme.rowBorder}`, transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <div style={{ fontWeight: "700", color: theme.textPrimary, fontSize: "1rem" }}>{c.name}</div>
                          <div style={{ fontSize: "0.8rem", color: theme.textMuted }}>{c.userId?.email || "Guest Voter"}</div>
                          {c.rating && (
                            <div style={{ marginTop: "4px", fontSize: "0.8rem", color: "#10b981", fontWeight: "700" }}>
                              {"⭐".repeat(c.rating)}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: "800", color: theme.accentPurple, background: theme.accentPurpleDim, display: "inline-block", padding: "2px 8px", borderRadius: "6px", marginBottom: "4px" }}>{c.category}</div>
                          <div style={{ fontSize: "1rem", fontWeight: "600", color: theme.textPrimary }}>{c.type}</div>
                          {c.imageUrl && (
                            <div style={{ marginTop: "0.75rem", borderRadius: "8px", overflow: "hidden", border: `1px solid ${theme.cardBorder}`, width: "120px" }}>
                              <img 
                                src={`${api.defaults.baseURL}${c.imageUrl}`} 
                                alt="Evidence" 
                                style={{ width: "100%", height: "80px", objectFit: "cover", cursor: "pointer" }}
                                onClick={() => window.open(`${api.defaults.baseURL}${c.imageUrl}`, '_blank')}
                              />
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <div style={{ fontSize: "1rem", fontWeight: "600", color: theme.textSecondary }}>{c.zone}</div>
                          {c.location && <div style={{ fontSize: "0.85rem", color: theme.textMuted }}>📍 {c.location}</div>}
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                             <div style={{ width: "40px", height: "6px", background: "rgba(0,0,0,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                               <div style={{ width: `${c.urgency * 10}%`, height: "100%", background: c.urgency > 7 ? "#ef4444" : c.urgency > 4 ? "#fbbf24" : "#10b981" }} />
                             </div>
                             <span style={{ fontSize: "0.9rem", fontWeight: "800", color: theme.textPrimary }}>{c.urgency}</span>
                          </div>
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800", color: theme.accentPurple }}>
                            🤝 {c.supporters?.length || 0}
                          </div>
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: "800", borderRadius: "8px", padding: "0.4rem 0.8rem", background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, textTransform: "uppercase" }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", color: theme.textSecondary, fontWeight: "500" }}>
                          {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {c.status !== "In Progress" && c.status !== "Resolved" && (
                              <button title="Mark In Progress" onClick={() => updateStatus(c._id, "In Progress")} style={{ padding: "0.5rem", borderRadius: "8px", cursor: "pointer", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}>🛠️</button>
                            )}
                            {c.status !== "Resolved" && (
                              <button title="Resolve" onClick={() => updateStatus(c._id, "Resolved")} style={{ padding: "0.5rem", borderRadius: "8px", cursor: "pointer", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>✅</button>
                            )}
                            <button title="Delete" onClick={() => deleteComplaint(c._id)} style={{ padding: "0.5rem", borderRadius: "8px", cursor: "pointer", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.cardBorder}; borderRadius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${theme.accentPurpleBorder}; }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
