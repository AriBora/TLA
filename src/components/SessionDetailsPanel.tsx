import { useState } from "react";
import { Box, Card, Tab, Tabs } from "@mui/material";
import SessionDetailsTab from "./tabs/SessionDetailsTab";
import RequestsTab from "./tabs/RequestsTab";
import LogsTab from "./tabs/LogsTab";
import ErrorsTab from "./tabs/ErrorsTab";
import {
  mockErrors,
  mockLogs,
  mockRequests,
  mockSessionDetail,
} from "@/data/mockData";

export default function SessionDetailsPanel() {
  const [tab, setTab] = useState(0);
  return (
    <Card sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Session Details" />
          <Tab label={`Requests (${mockRequests.length})`} />
          <Tab label={`Logs (${mockLogs.length})`} />
          <Tab label={`Errors (${mockErrors.length})`} />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {tab === 0 && <SessionDetailsTab detail={mockSessionDetail} />}
        {tab === 1 && <RequestsTab rows={mockRequests} />}
        {tab === 2 && <LogsTab logs={mockLogs} />}
        {tab === 3 && <ErrorsTab errors={mockErrors} />}
      </Box>
    </Card>
  );
}
