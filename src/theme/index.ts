import { createTheme, type ThemeOptions } from "@mui/material/styles";

const base: ThemeOptions = {
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
};

export const darkTheme = createTheme({
  ...base,
  palette: {
    mode: "dark",
    primary: { main: "#3b82f6" },
    secondary: { main: "#a855f7" },
    success: { main: "#10b981" },
    warning: { main: "#f59e0b" },
    error: { main: "#ef4444" },
    background: {
      default: "#0a0f1e",
      paper: "#111827",
    },
    divider: "rgba(148,163,184,0.12)",
    text: {
      primary: "#e2e8f0",
      secondary: "#94a3b8",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(59,130,246,0.08), transparent 60%), radial-gradient(1000px 500px at 100% 0%, rgba(168,85,247,0.06), transparent 60%), #0a0f1e",
          minHeight: "100vh",
        },
        "*::-webkit-scrollbar": { width: 8, height: 8 },
        "*::-webkit-scrollbar-thumb": {
          background: "rgba(148,163,184,0.25)",
          borderRadius: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(17,24,39,0.7)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(148,163,184,0.1)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(10,15,30,0.7)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(148,163,184,0.1)",
          boxShadow: "none",
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  ...base,
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },
    secondary: { main: "#9333ea" },
    success: { main: "#059669" },
    warning: { main: "#d97706" },
    error: { main: "#dc2626" },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    divider: "rgba(15,23,42,0.08)",
    text: {
      primary: "#0f172a",
      secondary: "#475569",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(37,99,235,0.06), transparent 60%), #f8fafc",
          minHeight: "100vh",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 4px 16px rgba(15,23,42,0.04)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "none",
          color: "#0f172a",
        },
      },
    },
  },
});

export const severityColor = (s: string) => {
  switch (s) {
    case "success":
      return "#10b981";
    case "warning":
      return "#f59e0b";
    case "error":
      return "#ef4444";
    case "fatal":
      return "#7f1d1d";
    default:
      return "#64748b";
  }
};
