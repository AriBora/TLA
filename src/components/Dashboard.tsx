import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Header from "./Header";
import StatsCards from "./StatsCards";
import SessionsTimeline from "./SessionsTimeline";
import SessionDetailsPanel from "./SessionDetailsPanel";
import AIAssistantPanel from "./AIAssistantPanel";
import { mockStats, mockUserSessions } from "../data/mockData";
import type { TimeRange } from "../types";

export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>("24h");
  const [, setRefreshKey] = useState(0);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header
        range={range}
        onRangeChange={setRange}
        onRefresh={() => setRefreshKey((k) => k + 1)}
      />

      <Box
        sx={{
          display: "grid",
          gap: 3,
          p: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 7fr) minmax(0, 3fr)" },
          alignItems: "start",
        }}
      >
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
              Sessions Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explore user sessions, requests and errors in your Tableau Server logs.
            </Typography>
          </Box>

          <StatsCards stats={mockStats} />

          <SessionsTimeline sessions={mockUserSessions} onSelectSession={() => { }} />

          <SessionDetailsPanel />
        </Stack>

        <Box
          sx={{
            position: { lg: "sticky" },
            top: { lg: 88 },
            minWidth: 0,
            height: { lg: "calc(100vh - 104px)" },
          }}
        >
          <AIAssistantPanel />
        </Box>
      </Box>
    </Box>
  );
}
