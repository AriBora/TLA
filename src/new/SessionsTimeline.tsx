import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  InputBase,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import { format } from "date-fns";
import type { SessionFilter, SessionSegment, UserSession } from "@/types";
import { severityColor } from "@/theme";

interface Props {
  sessions: UserSession[];
  rangeStart: Date;
  rangeEnd: Date;
  selectedSegmentId?: string;
  onSelectSession: (s: SessionSegment, u: UserSession) => void;
}

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Stack>
);

const FILTERS: { value: SessionFilter; label: string }[] = [
  { value: "all", label: "All sessions" },
  { value: "errors", label: "Errors only" },
  { value: "fatal", label: "Fatal only" },
  { value: "warnings", label: "Warnings & above" },
  { value: "success", label: "Successful only" },
];

function matchesFilter(seg: SessionSegment, f: SessionFilter) {
  switch (f) {
    case "all":
      return true;
    case "errors":
      return seg.severity === "error" || seg.severity === "fatal";
    case "fatal":
      return seg.severity === "fatal";
    case "warnings":
      return seg.severity !== "success";
    case "success":
      return seg.severity === "success";
  }
}

export default function SessionsTimeline({
  sessions,
  rangeStart,
  rangeEnd,
  selectedSegmentId,
  onSelectSession,
}: Props) {
  const [query, setQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [sevFilter, setSevFilter] = useState<SessionFilter>("all");

  const startMs = rangeStart.getTime();
  const endMs = rangeEnd.getTime();
  const span = Math.max(1, endMs - startMs);

  const filtered = useMemo(() => {
    return sessions
      .filter(
        (s) =>
          (userFilter === "all" || s.id === userFilter) &&
          s.user.toLowerCase().includes(query.toLowerCase()),
      )
      .map((s) => ({
        ...s,
        segments: s.segments.filter(
          (seg) =>
            matchesFilter(seg, sevFilter) &&
            seg.end.getTime() > startMs &&
            seg.start.getTime() < endMs,
        ),
      }))
      .filter((s) => s.segments.length > 0);
  }, [sessions, query, userFilter, sevFilter, startMs, endMs]);

  // Build ~7 evenly spaced ticks across the window
  const ticks = useMemo(() => {
    const N = 7;
    return Array.from({ length: N + 1 }, (_, i) => {
      const t = new Date(startMs + (span * i) / N);
      return { t, pct: (i / N) * 100 };
    });
  }, [startMs, span]);

  return (
    <Card sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ mb: 2, alignItems: { md: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h6">User Sessions Timeline</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
            <LegendDot color={severityColor("success")} label="Success" />
            <LegendDot color={severityColor("warning")} label="Warning" />
            <LegendDot color={severityColor("error")} label="Error" />
            <LegendDot color={severityColor("fatal")} label="Fatal" />
            <Typography variant="caption" color="text.secondary">
              {format(rangeStart, "dd MMM HH:mm")} – {format(rangeEnd, "dd MMM HH:mm")}
            </Typography>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              height: 36,
              width: 220,
              borderRadius: 2,
              border: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Search sx={{ fontSize: 18, opacity: 0.6 }} />
            <InputBase
              placeholder="Search user…"
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
          <Select
            size="small"
            value={sevFilter}
            onChange={(e) => setSevFilter(e.target.value as SessionFilter)}
            startAdornment={<FilterList sx={{ fontSize: 18, mr: 0.75, opacity: 0.7 }} />}
            sx={{ minWidth: 190, height: 36 }}
          >
            {FILTERS.map((f) => (
              <MenuItem key={f.value} value={f.value}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: 720 }}>
          {/* time axis */}
          <Stack direction="row" sx={{ pl: "200px", mb: 1 }}>
            <Box sx={{ position: "relative", flex: 1, height: 18 }}>
              {ticks.map((tick, idx) => (
                <Typography
                  key={idx}
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    position: "absolute",
                    left: `${tick.pct}%`,
                    transform:
                      idx === 0
                        ? "translateX(0)"
                        : idx === ticks.length - 1
                          ? "translateX(-100%)"
                          : "translateX(-50%)",
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {format(tick.t, "dd MMM HH:mm")}
                </Typography>
              ))}
            </Box>
          </Stack>

          {/* rows */}
          {filtered.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: "center",
                color: "text.secondary",
                border: (t) => `1px dashed ${t.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="body2">
                No sessions match the selected window and filters.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.25}>
              {filtered.map((u) => (
                <Stack key={u.id} direction="row" sx={{ alignItems: "center" }}>
                  <Stack
                    direction="row"
                    spacing={1.25}
                    sx={{ width: 200, alignItems: "center" }}
                  >
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
                        {u.segments.length} session{u.segments.length === 1 ? "" : "s"} in range
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
                      const s = Math.max(seg.start.getTime(), startMs);
                      const e = Math.min(seg.end.getTime(), endMs);
                      const left = ((s - startMs) / span) * 100;
                      const width = Math.max(0.4, ((e - s) / span) * 100);
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
                                {format(seg.start, "dd MMM HH:mm")} –{" "}
                                {format(seg.end, "dd MMM HH:mm")}
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
                              boxShadow:
                                selectedSegmentId === seg.id
                                  ? `0 0 0 2px #fff, 0 0 14px ${severityColor(seg.severity)}`
                                  : `0 0 12px ${severityColor(seg.severity)}55`,
                              outline:
                                selectedSegmentId === seg.id
                                  ? `2px solid ${severityColor(seg.severity)}`
                                  : "none",
                              outlineOffset: selectedSegmentId === seg.id ? 1 : 0,
                              transition: "transform .15s ease, filter .15s ease",
                              "&:hover": {
                                transform: "scaleY(1.15)",
                                filter: "brightness(1.15)",
                              },
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Card>
  );
}
