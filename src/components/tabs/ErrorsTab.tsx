import { Box, Card, Chip, Stack, Typography } from "@mui/material";
import { BugReport, BuildCircle } from "@mui/icons-material";
import type { ErrorEntry } from "../../types";
import { severityColor } from "../../theme";

export default function ErrorsTab({ errors }: { errors: ErrorEntry[] }) {
  return (
    <Stack spacing={2}>
      {errors.map((e) => (
        <Card
          key={e.id}
          sx={{
            p: 2.5,
            borderLeft: `3px solid ${severityColor(e.severity)}`,
            transition: "transform .15s ease",
            "&:hover": { transform: "translateY(-1px)" },
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 1.5, justifyContent: 'space-between', alignItems: { md: "center" } }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <BugReport sx={{ color: severityColor(e.severity) }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {e.title}
              </Typography>
              <Chip
                size="small"
                label={e.severity.toUpperCase()}
                sx={{
                  height: 20,
                  fontWeight: 700,
                  fontSize: 10,
                  bgcolor: `${severityColor(e.severity)}22`,
                  color: severityColor(e.severity),
                  border: `1px solid ${severityColor(e.severity)}55`,
                }}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                ⏱ {e.timestamp}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                🔗 {e.requestId}
              </Typography>
            </Stack>
          </Stack>

          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: (t) =>
                t.palette.mode === "dark" ? "rgba(2,6,23,0.6)" : "rgba(15,23,42,0.04)",
              fontSize: 12,
              fontFamily: '"JetBrains Mono", monospace',
              color: "text.secondary",
              overflow: "auto",
            }}
          >
            {e.stack}
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Root Cause
              </Typography>
              <Typography variant="body2">{e.rootCause}</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <BuildCircle sx={{ fontSize: 16, color: "primary.main" }} />
                <Typography variant="caption" color="text.secondary">
                  Suggested Remediation
                </Typography>
              </Stack>
              <Typography variant="body2">{e.remediation}</Typography>
            </Box>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
