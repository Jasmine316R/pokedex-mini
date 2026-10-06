import { useEffect, useMemo, useState } from "react";
import { PokedexContext } from "./pokedex.js";

const FAVORITES_KEY = "pokedex-favorites";
const THEME_KEY = "pokedex-theme";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function PokedexProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readJson(FAVORITES_KEY, []));
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const next = saved === "day" || saved === "night" ? saved : "night";
    document.documentElement.dataset.theme = next;
    return next;
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite: (name) => favorites.includes(name),
      toggleFavorite: (name) => {
        setFavorites((prev) =>
          prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
      },
      theme,
      toggleTheme: () => setTheme((t) => (t === "night" ? "day" : "night")),
    }),
    [favorites, theme]
  );

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
}
