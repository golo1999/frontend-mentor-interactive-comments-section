import React, { useCallback, useEffect } from "react";
import { ThemeProvider } from "styled-components";

import { Router } from "router";
import { useSettingsStore } from "store";
import { DARK_THEME, LIGHT_THEME } from "theme";

export function App() {
  const { theme, setScrollPosition } = useSettingsStore();

  const handleScroll = useCallback(
    () => setScrollPosition(window.scrollY),
    [setScrollPosition]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const currentTheme = theme === "DARK" ? DARK_THEME : LIGHT_THEME;

  return (
    <ThemeProvider theme={currentTheme}>
      <Router />
    </ThemeProvider>
  );
}
