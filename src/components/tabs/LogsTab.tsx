import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  InputBase,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ContentCopy, ExpandLess, ExpandMore, Search } from "@mui/icons-material";
import type { LogEntry, LogLevel } from "../../types";

const LEVEL_COLOR: Record<LogLevel, string> = {
  DEBUG: "#64748b",
  INFO: "#3b82f6",
  WARN: "#f59e0b",
  ERROR: "#ef4444",
  FATAL: "#7f1d1d",
};

const colorize = (msg: string) =>
  msg
    .replace(/`([^`]+)`/g, '<span style="color:#a78bfa">$1</span>')
    .replace(
      /\b(\d+(\.\d+)?(s|ms|m))\b/g,
      '<span style="color:#f59e0b">$1</span>',
    )
    .replace(/\b([A-Z][A-Za-z]+Error|timeout|exhausted|failed)\b/g, '<span style="color:#ef4444">$1</span>');

export default function LogsTab({ logs }: { logs: LogEntry[] }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const filtered = useMemo(
    () => logs.filter((l) => l.message.toLowerCase().includes(query.toLowerCase())),
    [logs, query],
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            height: 36,
            width: 320,
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <Search sx={{ fontSize: 18, opacity: 0.6 }} />
          <InputBase
            placeholder="Filter logs…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ flex: 1, fontSize: 13 }}
          />
        </Box>
        <Tooltip title="Copy all">
          <IconButton
            size="small"
            onClick={() => navigator.clipboard?.writeText(logs.map((l) => l.message).join("\n"))}
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        sx={{
          fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12.5,
          borderRadius: 2,
          border: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: (t) =>
            t.palette.mode === "dark" ? "rgba(2,6,23,0.6)" : "rgba(15,23,42,0.02)",
          maxHeight: 460,
          overflow: "auto",
        }}
      >
        {filtered.map((l) => {
          const hasMeta = !!l.meta;
          const open = expanded[l.line];
          return (
            <Box key={l.line}>
              <Stack direction="row" spacing={1.5} sx={{
                px: 1.5,
                py: 0.6,
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
                "&:hover": {
                  bgcolor: (t) =>
                    t.palette.mode === "dark"
                      ? "rgba(148,163,184,0.05)"
                      : "rgba(15,23,42,0.03)",
                },
              }}
              >
                <Typography
                  component="span"
                  sx={{ width: 28, color: "text.secondary", textAlign: "right", userSelect: "none" }}
                >
                  {l.line}
                </Typography>
                <Typography component="span" sx={{ width: 92, color: "text.secondary" }}>
                  {l.timestamp}
                </Typography>
                <Chip
                  label={l.level}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    width: 56,
                    bgcolor: `${LEVEL_COLOR[l.level]}22`,
                    color: LEVEL_COLOR[l.level],
                    border: `1px solid ${LEVEL_COLOR[l.level]}55`,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    component="span"
                    sx={{ fontFamily: "inherit", fontSize: "inherit" }}
                    dangerouslySetInnerHTML={{ __html: colorize(l.message) }}
                  />
                </Box>
                {hasMeta && (
                  <IconButton
                    size="small"
                    onClick={() => setExpanded((p) => ({ ...p, [l.line]: !open }))}
                  >
                    {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </IconButton>
                )}
              </Stack>
              {hasMeta && (
                <Collapse in={open}>
                  <Box
                    sx={{
                      pl: 17,
                      pr: 2,
                      py: 1,
                      bgcolor: (t) =>
                        t.palette.mode === "dark"
                          ? "rgba(148,163,184,0.04)"
                          : "rgba(15,23,42,0.02)",
                    }}
                  >
                    <pre style={{ margin: 0, color: "#94a3b8" }}>
                      {JSON.stringify(l.meta, null, 2)}
                    </pre>
                  </Box>
                </Collapse>
              )}
            </Box>
          );
        })}
      </Box>
    </Stack>
  );
}
