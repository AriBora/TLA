import { Box, Chip, Stack, Typography } from "@mui/material";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ContentCopy } from "@mui/icons-material";
import type { SessionDetail } from "../../types";

const MetaRow = ({ icon, label, value }: { icon: string; label: string; value: React.ReactNode }) => (
  <Stack direction="row" spacing={1.5} sx={{ py: 0.75, alignItems: 'center' }}>
    <Typography variant="caption" color="text.secondary" sx={{ width: 110 }}>
      {icon} {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {value}
    </Typography>
  </Stack>
);

export default function SessionDetailsTab({ detail }: { detail: SessionDetail }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      }}
    >
      <Box>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
          <Chip
            label="ERROR"
            size="small"
            sx={{ bgcolor: "#ef444422", color: "#ef4444", fontWeight: 700, height: 22 }}
          />
          <Typography variant="caption" color="text.secondary">
            Session ID:
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
            {detail.id}
          </Typography>
          <ContentCopy sx={{ fontSize: 14, opacity: 0.6, cursor: "pointer" }} />
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 3,
          }}
        >
          <Box>
            <MetaRow icon="👤" label="User" value={detail.user} />
            <MetaRow icon="🏷" label="Site" value={detail.site} />
            <MetaRow icon="🕐" label="Start Time" value={detail.startTime} />
          </Box>
          <Box>
            <MetaRow icon="🏁" label="End Time" value={detail.endTime} />
            <MetaRow icon="⏱" label="Duration" value={detail.duration} />
            <MetaRow icon="📦" label="Requests" value={detail.requests} />
            <MetaRow
              icon="●"
              label="Status"
              value={
                <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: 600 }}>
                  {detail.status}
                </Typography>
              }
            />
          </Box>
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Session Summary
        </Typography>
        <Box sx={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={detail.breakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
              >
                {detail.breakdown.map((d) => (
                  <Cell key={d.name} fill={d.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(17,24,39,0.95)",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: 8,
                  color: "#e2e8f0",
                }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                formatter={(v, e: any) => {
                  const total = detail.breakdown.reduce((a, b) => a + b.value, 0);
                  const val = e?.payload?.value ?? 0;
                  const pct = ((val / total) * 100).toFixed(1);
                  return `${v}  ${val} (${pct}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Box>
  );
}
