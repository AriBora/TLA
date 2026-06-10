import { useMemo, useState } from "react";
import { Box, Chip, IconButton, InputBase, Stack, Tooltip } from "@mui/material";
import { AttachFile, CheckCircle, Search, Subject } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { RequestRow } from "@/types";
import { severityColor } from "@/theme";

const SeverityChip = ({ severity }: { severity: string }) => (
  <Chip
    label={severity}
    size="small"
    sx={{
      textTransform: "uppercase",
      fontSize: 10,
      fontWeight: 700,
      height: 20,
      bgcolor: `${severityColor(severity)}22`,
      color: severityColor(severity),
      border: `1px solid ${severityColor(severity)}44`,
    }}
  />
);

interface Props {
  rows: RequestRow[];
  onShowLogs: (reqId: string) => void;
  onAttach: (req: RequestRow) => void;
  attachedIds: string[];
}

export default function RequestsTab({ rows, onShowLogs, onAttach, attachedIds }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        [r.id, r.endpoint, r.workbook, r.queryType]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [rows, query],
  );

  const columns: GridColDef<RequestRow>[] = [
    { field: "id", headerName: "Request ID", width: 150 },
    { field: "endpoint", headerName: "Endpoint", flex: 1, minWidth: 180 },
    { field: "workbook", headerName: "Workbook / View", flex: 1, minWidth: 150 },
    {
      field: "duration",
      headerName: "Duration",
      width: 110,
      renderCell: (p) => (
        <span
          style={{
            color: p.value > 3000 ? "#ef4444" : p.value > 1500 ? "#f59e0b" : undefined,
            fontWeight: p.value > 1500 ? 600 : 400,
          }}
        >
          {p.value} ms
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 90,
      renderCell: (p) => (
        <Chip
          label={p.value}
          size="small"
          sx={{
            height: 20,
            fontWeight: 700,
            fontSize: 11,
            bgcolor: p.value === 200 ? "#10b98122" : "#ef444422",
            color: p.value === 200 ? "#10b981" : "#ef4444",
          }}
        />
      ),
    },
    { field: "timestamp", headerName: "Timestamp", width: 110 },
    {
      field: "severity",
      headerName: "Severity",
      width: 110,
      renderCell: (p) => <SeverityChip severity={p.value} />,
    },
    { field: "queryType", headerName: "Query", width: 110 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (p) => {
        const attached = attachedIds.includes(p.row.id);
        return (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Show logs for this request">
              <IconButton size="small" onClick={() => onShowLogs(p.row.id)}>
                <Subject fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={attached ? "Attached to AI" : "Attach logs to AI Assistant"}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => onAttach(p.row)}
                  disabled={attached}
                  sx={{ color: attached ? "success.main" : undefined }}
                >
                  {attached ? (
                    <CheckCircle fontSize="small" />
                  ) : (
                    <AttachFile fontSize="small" />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Stack spacing={2}>
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
          placeholder="Search requests…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flex: 1, fontSize: 13 }}
        />
      </Box>
      <Box sx={{ height: 460 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          density="compact"
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-cell": { borderColor: (t) => t.palette.divider },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: (t) =>
                t.palette.mode === "dark"
                  ? "rgba(148,163,184,0.06)"
                  : "rgba(15,23,42,0.03)",
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: (t) =>
                t.palette.mode === "dark"
                  ? "rgba(59,130,246,0.08)"
                  : "rgba(37,99,235,0.05)",
            },
          }}
        />
      </Box>
    </Stack>
  );
}
