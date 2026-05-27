import { Box, Card, Stack, Typography } from "@mui/material";
import {
  Groups,
  Description,
  Schedule,
  Warning,
  Error as ErrorIcon,
  Person,
} from "@mui/icons-material";
import type { StatCard } from "@/types";

const ICONS: Record<string, React.ElementType> = {
  groups: Groups,
  description: Description,
  schedule: Schedule,
  warning: Warning,
  error: ErrorIcon,
  person: Person,
};

export default function StatsCards({ stats }: { stats: StatCard[] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(3,1fr)",
          xl: "repeat(6,1fr)",
        },
      }}
    >
      {stats.map((s) => {
        const Icon = ICONS[s.icon] ?? Groups;
        return (
          <Card
            key={s.key}
            sx={{
              p: 2.25,
              transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: s.color,
                boxShadow: `0 12px 30px ${s.color}22`,
              },
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`,
                  border: `1px solid ${s.color}44`,
                  color: s.color,
                  boxShadow: `0 0 24px ${s.color}22`,
                }}
              >
                <Icon />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  {s.label}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}
                >
                  {s.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {s.subtitle}
                </Typography>
              </Box>
            </Stack>
          </Card>
        );
      })}
    </Box>
  );
}
