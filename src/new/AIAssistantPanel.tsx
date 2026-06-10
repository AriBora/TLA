import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  Chip,
  IconButton,
  InputBase,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { AttachFile, AutoAwesome, DeleteOutlined, Send } from "@mui/icons-material";
import type { ChatMessage, LogAttachment } from "@/types";
import { mockChat } from "@/data/mockData";

const renderMarkdown = (text: string) => {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let listBuf: string[] = [];
  let orderedBuf: string[] = [];
  const flushUl = () => {
    if (listBuf.length) {
      out.push(
        <Box component="ul" key={out.length} sx={{ pl: 3, my: 0.5 }}>
          {listBuf.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />
          ))}
        </Box>,
      );
      listBuf = [];
    }
  };
  const flushOl = () => {
    if (orderedBuf.length) {
      out.push(
        <Box component="ol" key={out.length} sx={{ pl: 3, my: 0.5 }}>
          {orderedBuf.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inline(li) }} />
          ))}
        </Box>,
      );
      orderedBuf = [];
    }
  };
  const inline = (s: string) =>
    s
      .replace(/`([^`]+)`/g, '<code style="background:rgba(148,163,184,0.15);padding:1px 5px;border-radius:4px;font-size:12px">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (/^\s*-\s+/.test(line)) {
      flushOl();
      listBuf.push(line.replace(/^\s*-\s+/, ""));
    } else if (/^\s*\d+\.\s+/.test(line)) {
      flushUl();
      orderedBuf.push(line.replace(/^\s*\d+\.\s+/, ""));
    } else if (/^\*\*([^*]+)\*\*$/.test(line)) {
      flushUl();
      flushOl();
      out.push(
        <Typography
          key={idx}
          variant="subtitle2"
          sx={{ fontWeight: 700, mt: 1.25, mb: 0.5 }}
        >
          {line.replace(/\*\*/g, "")}
        </Typography>,
      );
    } else if (line.trim() === "") {
      flushUl();
      flushOl();
    } else {
      flushUl();
      flushOl();
      out.push(
        <Typography
          key={idx}
          variant="body2"
          sx={{ my: 0.5 }}
          dangerouslySetInnerHTML={{ __html: inline(line) }}
        />,
      );
    }
  });
  flushUl();
  flushOl();
  return out;
};

const CANNED_RESPONSES = [
  "**Insight**\n\n- Heavy query execution caused VizQL thread starvation on `vizqlserver_node1`.\n- Datasource timeout detected on `Sales_Extract`.\n\n**Recommendation**\n\n1. Add an index on `amount` column.\n2. Increase `vizqlserver.query_timeout` to 120s.\n3. Monitor Hyper memory pressure.",
  "**Server Impact**\n\nDetected possible Hyper extract contention and concurrent workbook rendering spike between 14:30–14:35.\n\n- Avg query latency rose 3.2x\n- Thread pool utilization peaked at 98%\n- 4 requests returned HTTP 504",
];

interface Props {
  attachments: LogAttachment[];
  onRemoveAttachment: (id: string) => void;
  onClearAttachments: () => void;
}

export default function AIAssistantPanel({
  attachments,
  onRemoveAttachment,
  onClearAttachments,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChat);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text && attachments.length === 0) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const attachmentNote =
      attachments.length > 0
        ? `\n\n**Attached logs (${attachments.length}):**\n` +
          attachments
            .map(
              (a) =>
                `- \`${a.id}\` — ${a.logs.length} log line${a.logs.length === 1 ? "" : "s"}`,
            )
            .join("\n")
        : "";
    const userContent = (text || "Analyze the attached request logs.") + attachmentNote;
    setMessages((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", content: userContent, timestamp: now },
    ]);
    setInput("");
    onClearAttachments();
    setTyping(true);
    setTimeout(() => {
      const reply = CANNED_RESPONSES[Math.floor(Math.random() * CANNED_RESPONSES.length)];
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", content: reply, timestamp: now },
      ]);
      setTyping(false);
    }, 1100);
  };

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 600 }}>
      <Stack direction="row" sx={{ px: 2.5, py: 1.75, borderBottom: 1, borderColor: "divider", alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg,#3b82f6,#a855f7)",
            }}
          >
            <AutoAwesome sx={{ fontSize: 16, color: "#fff" }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            AI Assistant
          </Typography>
        </Stack>
        <IconButton size="small" onClick={() => setMessages([])}>
          <DeleteOutlined fontSize="small" />
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            Clear Chat
          </Typography>
        </IconButton>
      </Stack>

      <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: 2.5 }}>
        <Stack spacing={2}>
          {messages.map((m) => (
            <Box
              key={m.id}
              sx={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "92%",
                width: m.role === "assistant" ? "100%" : "auto",
              }}
            >
              <Box
                sx={{
                  px: 1.75,
                  py: 1.25,
                  borderRadius: 2,
                  background:
                    m.role === "user"
                      ? "linear-gradient(135deg,#3b82f6,#6366f1)"
                      : (t) =>
                          t.palette.mode === "dark"
                            ? "rgba(148,163,184,0.06)"
                            : "rgba(15,23,42,0.04)",
                  color: m.role === "user" ? "#fff" : "text.primary",
                  border: (t) =>
                    m.role === "assistant" ? `1px solid ${t.palette.divider}` : "none",
                }}
              >
                {m.role === "user" ? (
                  <Typography variant="body2">{m.content}</Typography>
                ) : (
                  <Box>{renderMarkdown(m.content)}</Box>
                )}
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5, textAlign: m.role === "user" ? "right" : "left" }}
              >
                {m.timestamp}
              </Typography>
            </Box>
          ))}
          {typing && (
            <Stack direction="row" spacing={1} sx={{ pl: 1, alignItems: 'center' }}>
              <Avatar sx={{ width: 22, height: 22, bgcolor: "primary.main" }}>
                <AutoAwesome sx={{ fontSize: 12 }} />
              </Avatar>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      animation: "bounce 1.2s infinite",
                      animationDelay: `${i * 0.15}s`,
                      "@keyframes bounce": {
                        "0%, 80%, 100%": { transform: "scale(0.7)", opacity: 0.5 },
                        "40%": { transform: "scale(1)", opacity: 1 },
                      },
                    }}
                  />
                ))}
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>

      {attachments.length > 0 && (
        <Box
          sx={{
            px: 1.5,
            pt: 1.25,
            pb: 0.5,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
            Attached:
          </Typography>
          {attachments.map((a) => (
            <Tooltip key={a.id} title={`${a.logs.length} log lines from ${a.id}`}>
              <Chip
                icon={<AttachFile sx={{ fontSize: 14 }} />}
                label={a.label}
                size="small"
                onDelete={() => onRemoveAttachment(a.id)}
                sx={{
                  maxWidth: 260,
                  bgcolor: (t) =>
                    t.palette.mode === "dark"
                      ? "rgba(59,130,246,0.15)"
                      : "rgba(59,130,246,0.10)",
                  border: (t) => `1px solid ${t.palette.primary.main}55`,
                  "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      )}

      <Box
        sx={{
          p: 1.5,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        <InputBase
          placeholder="Ask anything about the logs…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          sx={{
            flex: 1,
            px: 1.5,
            height: 40,
            fontSize: 14,
            borderRadius: 2,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        />
        <IconButton
          onClick={send}
          sx={{
            width: 40,
            height: 40,
            background: "linear-gradient(135deg,#3b82f6,#a855f7)",
            color: "#fff",
            "&:hover": { filter: "brightness(1.1)" },
          }}
        >
          <Send fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}
