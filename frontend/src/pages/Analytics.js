import React, { useState, useEffect } from "react";
import { Pie, Bar, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
} from "chart.js";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale
);

function Analytics() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/complaint/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ background: theme.pageBg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: theme.textSecondary }}>Loading analytics data...</p>
      </div>
    );
  }

  const statusData = {
    labels: stats?.status.map(s => s._id),
    datasets: [{
      data: stats?.status.map(s => s.count),
      backgroundColor: ["#fbbf24", "#60a5fa", "#34d399", "#ef4444"],
      borderWidth: 0,
    }]
  };

  const categoryData = {
    labels: stats?.category.map(c => c._id),
    datasets: [{
      label: "Complaints by Category",
      data: stats?.category.map(c => c.count),
      backgroundColor: theme.accentPurple,
      borderRadius: 10,
    }]
  };

  const zoneData = {
    labels: stats?.zone.map(z => z._id),
    datasets: [{
      data: stats?.zone.map(z => z.count),
      backgroundColor: [
        "rgba(99, 102, 241, 0.5)",
        "rgba(139, 92, 246, 0.5)",
        "rgba(20, 184, 166, 0.5)",
        "rgba(245, 158, 11, 0.5)",
        "rgba(239, 68, 68, 0.5)"
      ],
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: theme.textSecondary, font: { weight: "bold" } }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: theme.textMuted } },
      y: { grid: { color: theme.cardBorder }, ticks: { color: theme.textMuted } }
    }
  };

  const cardStyle = {
    background: theme.cardBg,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: "24px",
    padding: "2rem",
    boxShadow: theme.shadow,
    height: "400px"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", background: theme.pageBg, minHeight: "100vh", color: theme.textPrimary }}>
      <Navbar />
      <div style={{ flex: 1, width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "3rem 2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "3rem" }}>📊 Analytics Overview</h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
          
          <div style={cardStyle}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>Resolution Status</h3>
            <div style={{ height: "300px" }}>
              <Pie data={statusData} options={{ ...chartOptions, scales: {} }} />
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>Top Issues</h3>
            <div style={{ height: "300px" }}>
              <Bar data={categoryData} options={chartOptions} />
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem" }}>Zone Intensity</h3>
            <div style={{ height: "300px" }}>
              <PolarArea data={zoneData} options={{ ...chartOptions, scales: { r: { grid: { color: theme.cardBorder } } } }} />
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Analytics;
