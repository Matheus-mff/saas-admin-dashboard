"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldUseDark =
      savedTheme === "dark" ||
      (!savedTheme && prefersDark);

    document.documentElement.classList.toggle(
      "dark",
      shouldUseDark
    );

    queueMicrotask(() => {
      setIsDark(shouldUseDark);
    });
  }, []);

  function toggleTheme() {
    setIsDark((previousIsDark) => {
      const newIsDark = !previousIsDark;

      document.documentElement.classList.toggle(
        "dark",
        newIsDark
      );

      localStorage.setItem(
        "theme",
        newIsDark ? "dark" : "light"
      );

      return newIsDark;
    });
  }

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider."
    );
  }

  return context;
}