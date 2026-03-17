import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const themes = {
  dark: {
    mode: "dark",
    // Backgrounds
    pageBg: "#020617",
    heroGradient: "linear-gradient(160deg, #020617 0%, #0f172a 50%, #020617 100%)",
    cardBg: "rgba(30, 41, 59, 0.5)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    cardBorderFocus: "#818cf8",
    inputBg: "rgba(15, 23, 42, 0.6)",
    inputBorder: "rgba(255, 255, 255, 0.1)",
    navBg: "rgba(2, 6, 23, 0.8)",
    navBorder: "rgba(255, 255, 255, 0.05)",
    tableHeadBg: "rgba(255, 255, 255, 0.04)",
    rowBorder: "rgba(255, 255, 255, 0.03)",
    // Text
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    textFaint: "#475569",
    // Accents
    accentPurple: "#818cf8",
    accentPurpleDim: "rgba(129, 140, 248, 0.1)",
    accentPurpleBorder: "rgba(129, 140, 248, 0.3)",
    glow: "radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
    // Custom
    glass: "backdrop-filter: blur(12px) saturate(180%);",
    shadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    featureCardBg: "rgba(30, 41, 59, 0.4)",
    featureCardBorder: "rgba(255, 255, 255, 0.1)",
    stepCardBg: "rgba(30, 41, 59, 0.5)",
    stepCardBorder: "rgba(129, 140, 248, 0.2)",
    // Toggle
    toggleBg: "rgba(255, 255, 255, 0.08)",
    toggleColor: "#f1f5f9",
    toggleIcon: "☀️",
    toggleLabel: "Light Mode",
  },
  light: {
    mode: "light",
    // Backgrounds
    pageBg: "#f8fafc",
    heroGradient: "linear-gradient(160deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
    cardBg: "rgba(255, 255, 255, 0.7)",
    cardBorder: "rgba(0, 0, 0, 0.05)",
    cardBorderFocus: "#4f46e5",
    inputBg: "rgba(255, 255, 255, 0.8)",
    inputBorder: "rgba(0, 0, 0, 0.1)",
    navBg: "rgba(255, 255, 255, 0.8)",
    navBorder: "rgba(0, 0, 0, 0.05)",
    tableHeadBg: "rgba(0, 0, 0, 0.02)",
    rowBorder: "rgba(0, 0, 0, 0.02)",
    // Text
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#64748b",
    textFaint: "#94a3b8",
    // Accents
    accentPurple: "#4f46e5",
    accentPurpleDim: "rgba(79, 70, 229, 0.05)",
    accentPurpleBorder: "rgba(79, 70, 229, 0.2)",
    glow: "radial-gradient(circle at center, rgba(79, 70, 229, 0.08) 0%, transparent 70%)",
    // Custom
    glass: "backdrop-filter: blur(8px) saturate(150%);",
    shadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
    featureCardBg: "rgba(255, 255, 255, 0.8)",
    featureCardBorder: "rgba(0, 0, 0, 0.05)",
    stepCardBg: "rgba(255, 255, 255, 0.9)",
    stepCardBorder: "rgba(79, 70, 229, 0.1)",
    // Toggle
    toggleBg: "rgba(0, 0, 0, 0.05)",
    toggleColor: "#0f172a",
    toggleIcon: "🌙",
    toggleLabel: "Dark Mode",
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeKey, setThemeKey] = useState(() => {
    return localStorage.getItem("sccs-theme") || "dark";
  });

  const theme = themes[themeKey];

  const toggleTheme = () => {
    const next = themeKey === "dark" ? "light" : "dark";
    setThemeKey(next);
    localStorage.setItem("sccs-theme", next);
  };

  // Apply bg to html body for full-page coverage
  useEffect(() => {
    document.body.style.background = theme.pageBg;
    document.body.style.color = theme.textPrimary;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
