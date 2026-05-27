import type {
  ChatMessage,
  ErrorEntry,
  LogEntry,
  RequestRow,
  SessionDetail,
  StatCard,
  UserSession,
} from "@/types";

const severities = ["success", "warning", "error", "fatal"] as const;

function genSegments(seed: number) {
  const segments = [];
  let t = 0;
  let i = 0;
  while (t < 24) {
    const len = 0.5 + ((seed * (i + 1)) % 9) / 4;
    const r = (seed * 17 + i * 31) % 100;
    let severity: (typeof severities)[number] = "success";
    if (r > 92) severity = "fatal";
    else if (r > 80) severity = "error";
    else if (r > 65) severity = "warning";
    segments.push({
      id: `seg-${seed}-${i}`,
      start: t,
      end: Math.min(24, t + len),
      severity,
      label: `Session ${i + 1}`,
    });
    t += len;
    i++;
  }
  return segments;
}

export const mockUserSessions: UserSession[] = [
  { id: "u1", user: "Jane Smith", initials: "JS", sessionCount: 12, segments: genSegments(3) },
  { id: "u2", user: "Mark Brown", initials: "MB", sessionCount: 9, segments: genSegments(7) },
  { id: "u3", user: "Alex Turner", initials: "AT", sessionCount: 7, segments: genSegments(11) },
  { id: "u4", user: "Sarah Parker", initials: "SP", sessionCount: 10, segments: genSegments(5) },
  { id: "u5", user: "John White", initials: "JW", sessionCount: 8, segments: genSegments(13) },
  { id: "u6", user: "Emma Miller", initials: "EM", sessionCount: 6, segments: genSegments(19) },
  { id: "u7", user: "Liam Davis", initials: "LD", sessionCount: 11, segments: genSegments(23) },
  { id: "u8", user: "Olivia Chen", initials: "OC", sessionCount: 5, segments: genSegments(29) },
];

export const mockStats: StatCard[] = [
  { key: "sessions", label: "Total Sessions", value: "1,248", subtitle: "Across all nodes", color: "#3b82f6", icon: "groups" },
  { key: "requests", label: "Total Requests", value: "9,472", subtitle: "VizQL + REST", color: "#10b981", icon: "description" },
  { key: "avg", label: "Avg. Session Time", value: "06:42", subtitle: "Median 04:18", color: "#a855f7", icon: "schedule" },
  { key: "errors", label: "Total Errors", value: "132", subtitle: "Warn / Error / Fatal", color: "#f59e0b", icon: "warning" },
  { key: "failed", label: "Failed Requests", value: "98", subtitle: "HTTP 5xx + timeouts", color: "#ef4444", icon: "error" },
  { key: "users", label: "Active Users", value: "214", subtitle: "Last 24 hours", color: "#06b6d4", icon: "person" },
];

export const mockSessionDetail: SessionDetail = {
  id: "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
  user: "Jane Smith",
  site: "Default",
  startTime: "May 25, 2025 14:21:33",
  endTime: "May 25, 2025 14:35:58",
  duration: "00:14:25",
  status: "Completed with errors",
  requests: 14,
  breakdown: [
    { name: "Success", value: 10, color: "#10b981" },
    { name: "Warning", value: 2, color: "#f59e0b" },
    { name: "Error", value: 1, color: "#ef4444" },
    { name: "Fatal", value: 1, color: "#7f1d1d" },
  ],
};

export const mockRequests: RequestRow[] = Array.from({ length: 24 }, (_, i) => {
  const endpoints = ["/vizql/query", "/api/3.0/sites", "/views/Sales/Overview", "/wg/extract", "/api/auth/signin"];
  const wbs = ["Sales_Q2", "Marketing_Funnel", "OpsKPI", "RevenueForecast", "ExecBoard"];
  const queryTypes = ["SELECT", "EXTRACT", "AGGREGATE", "JOIN", "FILTER"];
  const dur = 50 + ((i * 137) % 4200);
  const sev = dur > 3000 ? "error" : dur > 1500 ? "warning" : "success";
  return {
    id: `REQ-${10000 + i}`,
    endpoint: endpoints[i % endpoints.length],
    workbook: wbs[i % wbs.length],
    duration: dur,
    status: dur > 3500 ? 500 : dur > 3000 ? 504 : 200,
    timestamp: `14:${String(20 + (i % 30)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
    severity: sev,
    rowsScanned: 1000 + i * 523,
    queryType: queryTypes[i % queryTypes.length],
  };
});

export const mockLogs: LogEntry[] = [
  { line: 1, level: "INFO", timestamp: "14:21:33.102", message: "Session a1b2c3d4 started for user jane.smith on site Default" },
  { line: 2, level: "DEBUG", timestamp: "14:21:33.221", message: "VizQL session bootstrap: workers=8, cache=warm", meta: { workers: 8, cache: "warm" } },
  { line: 3, level: "INFO", timestamp: "14:22:01.560", message: "Query dispatched to Hyper engine", meta: { ds: "Sales_Extract", rows: 124000 } },
  { line: 4, level: "WARN", timestamp: "14:23:15.870", message: "Slow query detected on datasource Sales_Extract (3.4s)" },
  { line: 5, level: "INFO", timestamp: "14:23:18.001", message: "Workbook 'Sales_Q2' rendered in 4.2s" },
  { line: 6, level: "ERROR", timestamp: "14:31:42.310", message: "VizQL timeout after 90s waiting for Hyper response", meta: { query: "SELECT SUM(amount) FROM ext", timeout_ms: 90000 } },
  { line: 7, level: "FATAL", timestamp: "14:32:00.018", message: "Thread pool exhausted on vizqlserver_node1" },
  { line: 8, level: "WARN", timestamp: "14:33:11.443", message: "Retrying query (attempt 2/3)" },
  { line: 9, level: "INFO", timestamp: "14:34:50.220", message: "Recovery successful, session resumed" },
  { line: 10, level: "INFO", timestamp: "14:35:58.910", message: "Session a1b2c3d4 ended with status: completed_with_errors" },
];

export const mockErrors: ErrorEntry[] = [
  {
    id: "ERR-001",
    title: "VizQL Query Timeout",
    severity: "error",
    timestamp: "14:31:42",
    requestId: "REQ-10018",
    stack: "at VizqlServer.executeQuery (vizqlserver.cpp:3422)\n  at QueryRunner.run (runner.cpp:128)\n  at ThreadPool.dispatch (pool.cpp:88)",
    rootCause: "Hyper engine exceeded 90s timeout while processing aggregation on Sales_Extract.",
    remediation: "Optimize extract, add indexes, or increase vizqlserver.query_timeout.",
  },
  {
    id: "ERR-002",
    title: "Thread Pool Exhausted",
    severity: "fatal",
    timestamp: "14:32:00",
    requestId: "REQ-10019",
    stack: "at ThreadPool.acquire (pool.cpp:42)\n  at SessionManager.handle (session.cpp:201)",
    rootCause: "Concurrent dashboard renders saturated the vizqlserver thread pool.",
    remediation: "Scale out vizqlserver nodes or tune vizqlserver.session_count.",
  },
  {
    id: "ERR-003",
    title: "Datasource Connection Lost",
    severity: "warning",
    timestamp: "14:33:11",
    requestId: "REQ-10021",
    stack: "at DataConnection.read (connection.cpp:88)",
    rootCause: "Transient network error to Hyper engine.",
    remediation: "Verify network between vizqlserver and dataengine nodes.",
  },
];

export const mockChat: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Explain the error in this session and suggest remediation steps.",
    timestamp: "14:36",
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "**Error Summary**\n\nThe session encountered a datasource query failure while executing a query on the `Sales_Extract` data source. The error is caused by a timeout while waiting for a response from the data engine.\n\n**Root Cause**\n\nThe VizQL Server query exceeded the timeout threshold (90 seconds) while waiting for data from the Hyper engine. This can happen due to:\n\n- Complex or unoptimized queries\n- High data volume\n- Resource constraints on the server\n- Network latency\n\n**Remediation Steps**\n\n1. Optimize the worksheet or dashboard causing the slow query.\n2. Check the data source and extract for performance issues.\n3. Increase the query timeout value if appropriate.\n4. Monitor server resources (CPU, memory, disk I/O).\n5. Review logs around the time for any resource contention.\n\nIs there anything specific you'd like me to investigate further?",
    timestamp: "14:36",
  },
];
