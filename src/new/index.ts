export type Severity = "success" | "warning" | "error" | "fatal";
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export interface UserSession {
  id: string;
  user: string;
  initials: string;
  sessionCount: number;
  segments: SessionSegment[];
}

export interface SessionSegment {
  id: string;
  start: Date; // absolute timestamp
  end: Date;
  severity: Severity;
  label: string;
}

export type SessionFilter = "all" | "errors" | "fatal" | "warnings" | "success";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface SessionDetail {
  id: string;
  user: string;
  site: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: "Completed" | "Completed with errors" | "Failed" | "Running";
  requests: number;
  breakdown: { name: string; value: number; color: string }[];
}

export interface RequestRow {
  id: string;
  endpoint: string;
  workbook: string;
  duration: number;
  status: number;
  timestamp: string;
  severity: Severity;
  rowsScanned: number;
  queryType: string;
}

export interface LogEntry {
  line: number;
  level: LogLevel;
  timestamp: string;
  message: string;
  meta?: Record<string, unknown>;
  requestId?: string;
}

export interface LogAttachment {
  id: string;
  label: string;
  logs: LogEntry[];
}

export interface ErrorEntry {
  id: string;
  title: string;
  severity: Severity;
  timestamp: string;
  requestId: string;
  stack: string;
  rootCause: string;
  remediation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface StatCard {
  key: string;
  label: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
}

export type TimeRange =
  | "today"
  | "1h"
  | "6h"
  | "12h"
  | "24h"
  | "48h";
