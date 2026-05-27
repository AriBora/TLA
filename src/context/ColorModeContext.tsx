import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "@/theme";

type Mode = "light" | "dark";

interface Ctx {
  mode: Mode;
  toggle: () => void;
}

const ColorModeContext = createContext<Ctx>({ mode: "dark", toggle: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("dark");
  const value = useMemo(
    () => ({ mode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) }),
    [mode],
  );
  const theme = mode === "dark" ? darkTheme : lightTheme;
  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
