import React, { useCallback, useEffect } from "react";

import { HomePage } from "pages";
import { useSettingsStore } from "store";

export function App() {
  const { setScrollPosition } = useSettingsStore();

  const handleScroll = useCallback(
    () => setScrollPosition(window.scrollY),
    [setScrollPosition]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return <HomePage />;
}
