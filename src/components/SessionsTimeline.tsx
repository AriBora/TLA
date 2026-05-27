import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Search, Settings } from "@mui/icons-material";
import type { SessionSegment, UserSession } from "@/types";
import { severityColor } from "@/theme";

interface Props {
  sessions: UserSession[];
  onSelectSession: (s: SessionSegment, u: UserSession) => void;
}

const HOURS = Array.from({ length: 9 }, (_, i) => i * 3);

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

export default function SessionsTimeline({ sessions, onSelectSession }: Props) {
  const [query, setQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");

  const filtered = useMemo(
    () =>
      sessions.filter(
        (s) =>
          (userFilter === "all" || s.id === userFilter) &&
          s.user.toLowerCase().includes(query.toLowerCase()),
      ),
    [sessions, query, userFilter],
  );

  return (
    <Card sx={{ p: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2, alignItems: { md: "center" }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6">User Sessions Timeline</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <LegendDot color={severityColor("success")} label="Success" />
            <LegendDot color={severityColor("warning")} label="Warning" />
            <LegendDot color={severityColor("error")} label="Error" />
            <LegendDot color={severityColor("fatal")} label="Fatal" />
          </Stack>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              height: 36,
              width: 240,
              borderRadius: 2,
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Search sx={{ fontSize: 18, opacity: 0.6 }} />
            <InputBase
              placeholder="Search session or user…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flex: 1, fontSize: 13 }}
            />
          </Box>
          <Select
            size="small"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            sx={{ minWidth: 140, height: 36 }}
          >
            <MenuItem value="all">All Users</MenuItem>
            {sessions.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.user}
              </MenuItem>
            ))}
          </Select>
          <IconButton size="small">
            <Settings fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: 720 }}>
          {/* time axis */}
          <Stack direction="row" sx={{ pl: "200px", mb: 1 }}>
            <Box sx={{ position: "relative", flex: 1, height: 18 }}>
              {HOURS.map((h) => (
                <Typography
                  key={h}
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    position: "absolute",
                    left: `${(h / 24) * 100}%`,
                    transform: "translateX(-50%)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(h).padStart(2, "0")}:00
                </Typography>
              ))}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ position: "absolute", right: 0, fontVariantNumeric: "tabular-nums" }}
              >
                24:00
              </Typography>
            </Box>
          </Stack>

          {/* rows */}
          <Stack spacing={1.25}>
            {filtered.map((u) => (
              <Stack key={u.id} direction="row" sx={{ alignItems: 'center' }}>
                <Stack direction="row" spacing={1.25} sx={{ width: 200, alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {u.initials}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {u.user}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {u.sessionCount} sessions
                    </Typography>
                  </Box>
                </Stack>
                <Box
                  sx={{
                    position: "relative",
                    flex: 1,
                    height: 28,
                    borderRadius: 1,
                    bgcolor: (t) =>
                      t.palette.mode === "dark"
                        ? "rgba(148,163,184,0.06)"
                        : "rgba(15,23,42,0.04)",
                    overflow: "hidden",
                  }}
                >
                  {u.segments.map((seg) => {
                    const left = (seg.start / 24) * 100;
                    const width = ((seg.end - seg.start) / 24) * 100;
                    return (
                      <Tooltip
                        key={seg.id}
                        title={
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {u.user}
                            </Typography>
                            <Typography variant="caption" sx={{ display: "block" }}>
                              {seg.label} · {seg.severity}
                            </Typography>
                            <Typography variant="caption" sx={{ display: "block" }}>
                              {seg.start.toFixed(2)}h – {seg.end.toFixed(2)}h
                            </Typography>
                          </Box>
                        }
                      >
                        <Box
                          onClick={() => onSelectSession(seg, u)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            bottom: 4,
                            left: `${left}%`,
                            width: `calc(${width}% - 2px)`,
                            borderRadius: 0.75,
                            cursor: "pointer",
                            bgcolor: severityColor(seg.severity),
                            boxShadow: `0 0 12px ${severityColor(seg.severity)}55`,
                            transition: "transform .15s ease, filter .15s ease",
                            "&:hover": { transform: "scaleY(1.15)", filter: "brightness(1.15)" },
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Card>
  );
}
