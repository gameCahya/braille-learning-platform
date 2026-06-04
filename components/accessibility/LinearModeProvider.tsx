"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface LinearModeContextValue {
  isLinear: boolean;
  toggle: () => void;
}

const LinearModeContext = createContext<LinearModeContextValue>({
  isLinear: false,
  toggle: () => {},
});

const STORAGE_KEY = "bralingo-linear-mode";

export function LinearModeProvider({ children }: { children: React.ReactNode }) {
  const [isLinear, setIsLinear] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setIsLinear(true);
    } catch {}
    setMounted(true);
  }, []);

  // Simpan + toggle class di body
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, String(isLinear));
    } catch {}
    if (isLinear) {
      document.documentElement.classList.add("linear-mode");
    } else {
      document.documentElement.classList.remove("linear-mode");
    }
  }, [isLinear, mounted]);

  const toggle = useCallback(() => {
    setIsLinear((prev) => !prev);
  }, []);

  return (
    <LinearModeContext.Provider value={{ isLinear, toggle }}>
      {children}
    </LinearModeContext.Provider>
  );
}

export function useLinearMode() {
  return useContext(LinearModeContext);
}
