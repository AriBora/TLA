import { useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Header from "./Header";
import StatsCards from "./StatsCards";
import SessionsTimeline from "./SessionsTimeline";
import SessionDetailsPanel from "./SessionDetailsPanel";
import AIAssistantPanel from "./AIAssistantPanel";
import {
  buildSessionDetail,
  getLogsForSegment,
  getRequestsForSegment,
  mockStats,
  mockUserSessions,
} from "@/data/mockData";
import type { LogAttachment, RequestRow, SessionSegment, UserSession } from "@/types";

export default function Dashboard() {
  const { now, minDate } = useMemo(() => {
    const n = new Date();
    return { now: n, minDate: new Date(n.getTime() - 48 * 60 * 60 * 1000) };
  }, []);

  const [rangeStart, setRangeStart] = useState<Date>(
    () => new Date(now.getTime() - 24 * 60 * 60 * 1000),
  );
  const [rangeEnd, setRangeEnd] = useState<Date>(now);
  const [, setRefreshKey] = useState(0);

  // Default selection: first segment of first user
  const [selected, setSelected] = useState<{ user: UserSession; segment: SessionSegment }>(
    () => ({ user: mockUserSessions[0], segment: mockUserSessions[0].segments[0] }),
  );
  const [logFocusRequestId, setLogFocusRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [attachments, setAttachments] = useState<LogAttachment[]>([]);

  const requests = useMemo(
    () => getRequestsForSegment(selected.segment),
    [selected.segment],
  );
  const logs = useMemo(
    () => getLogsForSegment(selected.segment, requests),
    [selected.segment, requests],
  );
  const detail = useMemo(
    () => buildSessionDetail(selected.user, selected.segment, requests),
    [selected, requests],
  );

  const handleShowLogs = (reqId: string) => {
    setLogFocusRequestId(reqId);
    setActiveTab(2); // Logs tab
  };

  const handleAttach = (req: RequestRow) => {
    const reqLogs = logs.filter((l) => l.requestId === req.id);
    setAttachments((prev) =>
      prev.find((a) => a.id === req.id)
        ? prev
        : [
            ...prev,
            {
              id: req.id,
              label: `${req.id} · ${req.endpoint} (${reqLogs.length} log${reqLogs.length === 1 ? "" : "s"})`,
              logs: reqLogs,
            },
          ],
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ minHeight: "100vh" }}>
        <Header
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          minDate={minDate}
          maxDate={now}
          onRangeChange={(s, e) => {
            setRangeStart(s);
            setRangeEnd(e);
          }}
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

            <SessionsTimeline
              sessions={mockUserSessions}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              selectedSegmentId={selected.segment.id}
              onSelectSession={(segment, user) => {
                setSelected({ user, segment });
                setLogFocusRequestId(null);
                setActiveTab(0);
              }}
            />

            <SessionDetailsPanel
              detail={detail}
              requests={requests}
              logs={logs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              logFocusRequestId={logFocusRequestId}
              onClearLogFocus={() => setLogFocusRequestId(null)}
              onShowLogs={handleShowLogs}
              onAttachRequest={handleAttach}
              attachedRequestIds={attachments.map((a) => a.id)}
            />
          </Stack>

          <Box
            sx={{
              position: { lg: "sticky" },
              top: { lg: 88 },
              minWidth: 0,
              height: { lg: "calc(100vh - 104px)" },
            }}
          >
            <AIAssistantPanel
              attachments={attachments}
              onRemoveAttachment={(id) =>
                setAttachments((prev) => prev.filter((a) => a.id !== id))
              }
              onClearAttachments={() => setAttachments([])}
            />
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
