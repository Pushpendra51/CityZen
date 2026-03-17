import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MapComponent from "../components/MapComponent";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const statusColors = {
  Pending: { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", border: "rgba(245,158,11,0.3)" },
  "In Progress": { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  Resolved: { bg: "rgba(16,185,129,0.15)", text: "#34d399", border: "rgba(16,185,129,0.3)" },
};

function Dashboard() {
  const { theme } = useTheme();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "", zone: "", category: "", type: "", urgency: "", description: "", location: "",
    latitude: null, longitude: null
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [viewMode, setViewMode] = useState("My"); // "My" or "Community"
  const [feedbackData, setFeedbackData] = useState({ rating: 5, feedback: "" });
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [selectedPos, setSelectedPos] = useState(null);

  const handleLocationSelect = (latlng) => {
    setSelectedPos(latlng);
    setFormData(prev => ({ ...prev, latitude: latlng.lat, longitude: latlng.lng }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const categories = [
    "Infrastructure", "Electricity", "Sanitation", "Water", "Public Safety", "Environment", "Transport", "Other"
  ];
  const complaintTypes = [
    "Pothole / Road Damage", "Street Lighting", "Garbage Collection",
    "Water Supply", "Drainage / Flooding", "Noise Pollution",
    "Illegal Construction", "Public Safety", "Park / Recreation", "Other",
  ];
  const zones = ["Zone A – North", "Zone B – South", "Zone C – East", "Zone D – West", "Zone E – Central"];

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const endpoint = viewMode === "My" ? "/api/complaint/my" : "/api/complaint/map-data";
      const res = await api.get(endpoint);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [viewMode]);

  const handleSupport = async (id) => {
    try {
      await api.post(`/api/complaint/support/${id}`);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const submitFeedback = async (id) => {
    try {
      await api.put(`/api/complaint/feedback/${id}`, feedbackData);
      toast.success("Thank you for your feedback!");
      setActiveFeedbackId(null);
      setFeedbackData({ rating: 5, feedback: "" });
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Feedback submission failed.");
    }
  };

  const handleAiSuggest = async () => {
    if (!formData.description) {
      toast.error("Please enter a description first so AI can analyze it.");
      return;
    }
    setIsAiLoading(true);
    const loadingToast = toast.loading("Analyzing description...");
    try {
      const res = await api.post("/api/complaint/analyze", { description: formData.description });
      setFormData(prev => ({
        ...prev,
        category: res.data.category,
        type: res.data.type,
        urgency: res.data.urgency.toString()
      }));
      toast.success("AI auto-filled Category, Type, and Urgency!", { id: loadingToast });
    } catch (err) {
      toast.error("AI analysis failed. Please select manually.", { id: loadingToast });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.zone || !formData.category || !formData.type || !formData.urgency || !formData.description) {
      toast.error("Please fill in all required fields."); return;
    }
    setSubmitting(true);
    const submitToast = toast.loading("Submitting your complaint...");
    
    // Use FormData for file upload
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) data.append(key, formData[key]);
    });
    if (image) data.append("image", image);

    try {
      await api.post("/api/complaint", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Complaint submitted successfully!", { id: submitToast });
      setFormData({ name: user.name || "", zone: "", category: "", type: "", urgency: "", description: "", location: "", latitude: null, longitude: null });
      setImage(null);
      setImagePreview(null);
      setSelectedPos(null);
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed.", { id: submitToast });
    } finally {
      setSubmitting(false);
    }
  };

  const pendingCount = complaints.filter((c) => c.status === "Pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  // Theme-aware styles
  const cardStyle = {
    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
    borderRadius: "24px", padding: "2rem",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(12px)",
    boxShadow: theme.shadow,
  };
  const inputStyle = {
    background: theme.inputBg, border: `1px solid ${theme.inputBorder}`,
    borderRadius: "12px", padding: "0.8rem 1rem",
    color: theme.textPrimary, fontSize: "0.95rem",
    outline: "none", width: "100%", fontFamily: "inherit",
    transition: "all 0.2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: theme.pageBg, minHeight: "100vh", color: theme.textPrimary, transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
      <Navbar />
      <div style={{ flex: 1, width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem", animation: "fadeIn 0.6s ease-out" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: theme.textPrimary, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
            My Dashboard
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user.avatar && (
              <img 
                src={user.avatar} 
                alt={user.name} 
                style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${theme.cardBorder}` }} 
              />
            )}
            Welcome back, <strong style={{ color: theme.accentPurple }}>{user.name}</strong> 👋
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem", animation: "fadeIn 0.8s ease-out" }}>
          {[
            { label: "Total Complaints", value: complaints.length, color: theme.accentPurple, icon: "📋" },
            { label: "Pending Issues", value: pendingCount, color: "#fbbf24", icon: "⏳" },
            { label: "Resolved Cases", value: resolvedCount, color: "#10b981", icon: "✅" },
          ].map((s) => (
            <div key={s.label} style={{ ...cardStyle, display: "flex", flexDirection: "row", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ fontSize: "2.5rem", background: "rgba(99,102,241,0.1)", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "2rem", fontWeight: "900", color: s.color, lineHeight: "1" }}>{s.value}</span>
                <span style={{ color: theme.textSecondary, fontSize: "0.95rem", fontWeight: "600", marginTop: "0.25rem" }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2.5rem", animation: "fadeIn 1s ease-out" }}>
          {/* Form */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: theme.textPrimary, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ background: theme.accentPurple, borderRadius: "8px", width: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📝</span>
              New Complaint
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ color: theme.textSecondary, fontSize: "0.9rem", fontWeight: "600" }}>Zone</label>
                  <select name="zone" value={formData.zone} onChange={handleChange} required style={inputStyle}>
                    <option value="">Select zone…</option>
                    {zones.map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ color: theme.textSecondary, fontSize: "0.9rem", fontWeight: "600" }}>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} required style={inputStyle}>
                    <option value="">Select category…</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ color: theme.textSecondary, fontSize: "0.9rem", fontWeight: "600" }}>Issue Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} required style={inputStyle}>
                    <option value="">Select type…</option>
                    {complaintTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ color: theme.textSecondary, fontSize: "0.9rem", fontWeight: "600" }}>
                    Urgency: <strong style={{ color: theme.accentPurple }}>{formData.urgency || "—"}/10</strong>
                  </label>
                  <input type="range" name="urgency" min="1" max="10" value={formData.urgency} onChange={handleChange} style={{ width: "100%", accentColor: theme.accentPurple, cursor: "pointer", height: "30px" }} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ color: theme.textSecondary, fontSize: "0.9rem", fontWeight: "600" }}>Location Details (Address/Landmark)</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="Building, Landmark, or Street Name" style={inputStyle} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ color: theme.textSecondary, fontSize: "0.9rem", fontWeight: "600" }}>
                  Pin Precise Map Location <span style={{ color: theme.textFaint, fontWeight: "Normal" }}>(Optional but recommended)</span>
                </label>
                <MapComponent 
                  onLocationSelect={handleLocationSelect} 
                  selectedPosition={selectedPos}
                  height="250px"
                />
                {selectedPos && (
                  <p style={{ fontSize: "0.8rem", color: theme.accentPurple, marginTop: "0.3rem", fontWeight: "500" }}>
                    📍 Coordinates set: {selectedPos.lat.toFixed(4)}, {selectedPos.lng.toFixed(4)}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ color: theme.textSecondary, fontSize: "0.9rem", fontWeight: "600" }}>Detailed Description</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange}
                  placeholder="Explain the issue in detail to help us resolve it faster…" required rows={5}
                  style={{ ...inputStyle, resize: "none" }}
                />
                <button 
                  type="button" 
                  onClick={handleAiSuggest} 
                  disabled={isAiLoading}
                  style={{
                    background: "rgba(99,102,241,0.1)", border: `1px dashed ${theme.accentPurple}`,
                    color: theme.accentPurple, borderRadius: "10px", padding: "0.6rem",
                    fontSize: "0.85rem", fontWeight: "700", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    marginTop: "-0.5rem"
                  }}
                >
                  {isAiLoading ? "Analyzing..." : "✨ Auto-fill with AI Magic"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ color: theme.textSecondary, fontSize: "0.9rem", fontWeight: "600" }}>⚡ Visual Evidence (Optional Photo)</label>
                <div style={{ 
                  border: `2px dashed ${theme.cardBorder}`, 
                  borderRadius: "16px", 
                  padding: "1.5rem", 
                  textAlign: "center",
                  background: theme.featureCardBg,
                  transition: "all 0.2s",
                }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    id="image-upload" 
                    style={{ display: "none" }} 
                  />
                  <label htmlFor="image-upload" style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                    ) : (
                      <>
                        <span style={{ fontSize: "2rem" }}>📸</span>
                        <span style={{ color: theme.accentPurple, fontWeight: "700" }}>Click to select photo</span>
                        <span style={{ color: theme.textFaint, fontSize: "0.8rem" }}>Supports JPG, PNG, WEBP (Max 5MB)</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button type="submit" disabled={submitting} style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff", border: "none", borderRadius: "14px", padding: "1.1rem",
                fontWeight: "800", fontSize: "1.05rem", cursor: "pointer",
                boxShadow: "0 10px 30px rgba(99,102,241,0.4)",
                opacity: submitting ? 0.7 : 1,
                transition: "all 0.2s",
                marginTop: "1rem",
              }} onMouseOver={e => !submitting && (e.target.style.transform = "translateY(-2px)")} onMouseOut={e => e.target.style.transform = "translateY(0)"}>
                {submitting ? "Submitting Report…" : "Submit Official Complaint →"}
              </button>
            </form>
          </div>

          {/* Complaints list */}
          <div style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: theme.textPrimary, display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ background: theme.accentPurpleDim, borderRadius: "8px", width: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📋</span>
                Complaints
              </h2>
              <div style={{ display: "flex", gap: "0.5rem", background: theme.inputBg, padding: "0.3rem", borderRadius: "12px" }}>
                {["My", "Community"].map(m => (
                  <button 
                    key={m} 
                    onClick={() => setViewMode(m)}
                    style={{
                      padding: "0.5rem 1rem", borderRadius: "10px", border: "none", fontSize: "0.85rem", fontWeight: "700",
                      background: viewMode === m ? theme.accentPurple : "transparent",
                      color: viewMode === m ? "#fff" : theme.textSecondary,
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div style={{ color: theme.textSecondary, textAlign: "center", padding: "5rem 0", fontSize: "1.1rem" }}>Initializing secure connection…</div>
            ) : complaints.length === 0 ? (
              <div style={{ color: theme.textSecondary, textAlign: "center", padding: "6rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ fontSize: "5rem", opacity: 0.5 }}>📭</div>
                <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>No complaints detected. Your neighborhood seems peaceful!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxHeight: "600px", overflowY: "auto", paddingRight: "0.5rem" }}>
                {complaints.map((c) => {
                  const sc = statusColors[c.status] || statusColors.Pending;
                  return (
                    <div key={c._id} style={{
                      background: theme.featureCardBg,
                      border: `1px solid ${theme.featureCardBorder}`,
                      borderRadius: "20px", padding: "1.5rem",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: "800", background: theme.accentPurpleDim, color: theme.accentPurple, padding: "2px 8px", borderRadius: "6px", textTransform: "uppercase" }}>{c.category}</span>
                            <span style={{ fontSize: "0.75rem", fontWeight: "600", color: theme.textMuted }}>• {c.zone}</span>
                          </div>
                          <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: theme.textPrimary }}>{c.type}</h3>
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: "800", borderRadius: "10px", padding: "0.4rem 1rem", background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, WebkitBackdropFilter: "blur(4px)" }}>
                          {c.status}
                        </span>
                      </div>
                      
                      {c.imageUrl && (
                        <div style={{ marginBottom: "1.25rem", borderRadius: "14px", overflow: "hidden", border: `1px solid ${theme.cardBorder}` }}>
                          <img 
                            src={`${api.defaults.baseURL}${c.imageUrl}`} 
                            alt="Complaint Evidence" 
                            style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }} 
                          />
                        </div>
                      )}

                      <p style={{ color: theme.textSecondary, fontSize: "1rem", lineHeight: "1.6", marginBottom: "1.25rem" }}>{c.description}</p>
                      {c.location && (
                         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: theme.textMuted, fontSize: "0.85rem", marginBottom: "1rem", background: "rgba(0,0,0,0.05)", padding: "0.5rem 0.75rem", borderRadius: "8px" }}>
                           📍 <span style={{ fontWeight: "600" }}>{c.location}</span>
                         </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: theme.textFaint, fontSize: "0.85rem", borderTop: `1px solid ${theme.rowBorder}`, paddingTop: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: c.urgency > 7 ? "#ef4444" : c.urgency > 4 ? "#fbbf24" : "#10b981" }} />
                          <span style={{ fontWeight: "600" }}>Urgency: {c.urgency}/10</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <button 
                            onClick={() => handleSupport(c._id)}
                            style={{
                              background: c.supporters?.includes(user._id || user.id) ? "rgba(99,102,241,0.2)" : "transparent",
                              border: `1px solid ${c.supporters?.includes(user._id || user.id) ? theme.accentPurple : theme.cardBorder}`,
                              borderRadius: "8px", padding: "4px 10px", color: theme.textPrimary, fontSize: "0.85rem",
                              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600"
                            }}
                          >
                            🤝 {c.supporters?.length || 0} Support
                          </button>
                          <span style={{ fontWeight: "500" }}>{new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Feedback UI */}
                      {c.status === "Resolved" && viewMode === "My" && !c.rating && (
                        <div style={{ marginTop: "1.5rem", background: "rgba(16,185,129,0.05)", borderRadius: "12px", padding: "1rem", border: "1px solid rgba(16,185,129,0.1)" }}>
                          {activeFeedbackId === c._id ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                              <div style={{ display: "flex", gap: "0.5rem", fontSize: "1.2rem", cursor: "pointer" }}>
                                {[1,2,3,4,5].map(star => (
                                  <span key={star} onClick={() => setFeedbackData({...feedbackData, rating: star})}>
                                    {star <= feedbackData.rating ? "⭐" : "☆"}
                                  </span>
                                ))}
                              </div>
                              <textarea 
                                placeholder="Your feedback..." 
                                value={feedbackData.feedback} 
                                onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})}
                                style={{ ...inputStyle, padding: "0.5rem", fontSize: "0.9rem" }}
                              />
                              <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button onClick={() => submitFeedback(c._id)} style={{ background: "#10b981", color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>Submit</button>
                                <button onClick={() => setActiveFeedbackId(null)} style={{ background: "transparent", border: "none", color: theme.textMuted, cursor: "pointer" }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "#10b981", fontWeight: "700", fontSize: "0.9rem" }}>✨ Issue Resolved! Rate our service:</span>
                              <button onClick={() => setActiveFeedbackId(c._id)} style={{ background: "#10b981", color: "#fff", border: "none", padding: "0.4rem 1rem", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" }}>Rate Now</button>
                            </div>
                          )}
                        </div>
                      )}

                      {c.rating && (
                        <div style={{ marginTop: "1rem", color: theme.textMuted, fontSize: "0.9rem", fontStyle: "italic" }}>
                          Rating: {"⭐".repeat(c.rating)} {c.feedback && `— "${c.feedback}"`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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

export default Dashboard;
