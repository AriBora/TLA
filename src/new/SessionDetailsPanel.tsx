import { Box, Card, Tab, Tabs } from "@mui/material";
import SessionDetailsTab from "./tabs/SessionDetailsTab";
import RequestsTab from "./tabs/RequestsTab";
import LogsTab from "./tabs/LogsTab";
import type { LogEntry, RequestRow, SessionDetail } from "@/types";

interface Props {
  detail: SessionDetail;
  requests: RequestRow[];
  logs: LogEntry[];
  activeTab: number;
  onTabChange: (v: number) => void;
  logFocusRequestId: string | null;
  onClearLogFocus: () => void;
  onShowLogs: (reqId: string) => void;
  onAttachRequest: (req: RequestRow) => void;
  attachedRequestIds: string[];
}

export default function SessionDetailsPanel({
  detail,
  requests,
  logs,
  activeTab,
  onTabChange,
  logFocusRequestId,
  onClearLogFocus,
  onShowLogs,
  onAttachRequest,
  attachedRequestIds,
}: Props) {
  return (
    <Card sx={{ p: 0, overflow: "hidden" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
        <Tabs value={activeTab} onChange={(_, v) => onTabChange(v)}>
          <Tab label="Session Details" />
          <Tab label={`Requests (${requests.length})`} />
          <Tab label={`Logs (${logs.length})`} />
        </Tabs>
      </Box>
      <Box sx={{ p: 3 }}>
        {activeTab === 0 && <SessionDetailsTab detail={detail} />}
        {activeTab === 1 && (
          <RequestsTab
            rows={requests}
            onShowLogs={onShowLogs}
            onAttach={onAttachRequest}
            attachedIds={attachedRequestIds}
          />
        )}
        {activeTab === 2 && (
          <LogsTab
            logs={logs}
            focusRequestId={logFocusRequestId}
            onClearFocus={onClearLogFocus}
          />
        )}
      </Box>
    </Card>
  );
}
