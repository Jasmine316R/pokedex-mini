import { createContext, useContext } from "react";

export const PokedexContext = createContext(null);

export function usePokedex() {
  const ctx = useContext(PokedexContext);
  if (!ctx) throw new Error("usePokedex must be used inside PokedexProvider");
  return ctx;
}
