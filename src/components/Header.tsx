import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Refresh,
  Search,
  Menu as MenuIcon,
  Analytics,
} from "@mui/icons-material";
import { useColorMode } from "@/context/ColorModeContext";
import type { TimeRange } from "@/types";

interface Props {
  range: TimeRange;
  onRangeChange: (r: TimeRange) => void;
  onRefresh: () => void;
  onMenuClick?: () => void;
}

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "1h", label: "Last 1 hour" },
  { value: "6h", label: "Last 6 hours" },
  { value: "12h", label: "Last 12 hours" },
  { value: "24h", label: "Last 24 hours" },
  { value: "48h", label: "Last 48 hours" },
];

export default function Header({ range, onRangeChange, onRefresh, onMenuClick }: Props) {
  const { mode, toggle } = useColorMode();

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 2, minHeight: 64 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg,#3b82f6,#a855f7)",
              boxShadow: "0 6px 20px rgba(59,130,246,0.4)",
            }}
          >
            <Analytics sx={{ color: "#fff", fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Tableau Log Analyzer
          </Typography>
        </Stack>

        <Box
          sx={{
            ml: 4,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
            px: 1.5,
            height: 38,
            flex: "0 1 360px",
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
            bgcolor: (t) =>
              t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)",
          }}
        >
          <Search sx={{ fontSize: 18, opacity: 0.6 }} />
          <InputBase placeholder="Search logs, sessions, users…" sx={{ flex: 1, fontSize: 14 }} />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Select
          size="small"
          value={range}
          onChange={(e) => onRangeChange(e.target.value as TimeRange)}
          sx={{ minWidth: 160, height: 38 }}
        >
          {RANGES.map((r) => (
            <MenuItem key={r.value} value={r.value}>
              {r.label}
            </MenuItem>
          ))}
        </Select>

        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh}>
            <Refresh />
          </IconButton>
        </Tooltip>

        <Tooltip title="Toggle theme">
          <IconButton onClick={toggle}>
            {mode === "dark" ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        <Button
          variant="text"
          sx={{ textTransform: "none", color: "text.primary", gap: 1, pl: 1 }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "secondary.main",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            AD
          </Avatar>
          <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1 }}>
              Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              SRE
            </Typography>
          </Box>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
