export const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

/**
 * Theme-grade color palette per type, used for dynamic background gradients.
 * Each entry has:
 *   bg1 / bg2  – gradient stops for the page background
 *   glow       – a saturated color for CSS box-shadow / glow effects
 *   text       – guaranteed readable text color on the gradient
 */
export const TYPE_THEME_COLORS = {
  normal:   { bg1: "#6d6a4e", bg2: "#3b3a2e", glow: "#d4d2a5", text: "#fff" },
  fire:     { bg1: "#9c3b12", bg2: "#451a08", glow: "#ff9d5c", text: "#fff" },
  water:    { bg1: "#2a4a8c", bg2: "#0e1e3d", glow: "#7bb4ff", text: "#fff" },
  electric: { bg1: "#8c7a0e", bg2: "#3d3506", glow: "#ffe066", text: "#fff" },
  grass:    { bg1: "#3d6e1e", bg2: "#1a2f0c", glow: "#a3e06e", text: "#fff" },
  ice:      { bg1: "#4a8a87", bg2: "#1c3a39", glow: "#b8f0ed", text: "#fff" },
  fighting: { bg1: "#7a1a16", bg2: "#330b09", glow: "#f06560", text: "#fff" },
  poison:   { bg1: "#6b2669", bg2: "#2e1030", glow: "#d06ecf", text: "#fff" },
  ground:   { bg1: "#8c7838", bg2: "#3d3418", glow: "#f0d880", text: "#fff" },
  flying:   { bg1: "#6650a8", bg2: "#2b2248", glow: "#c4b0ff", text: "#fff" },
  psychic:  { bg1: "#a12e50", bg2: "#451425", glow: "#ff85a8", text: "#fff" },
  bug:      { bg1: "#637010", bg2: "#2b3006", glow: "#c8de32", text: "#fff" },
  rock:     { bg1: "#706620", bg2: "#302c0c", glow: "#ddd04e", text: "#fff" },
  ghost:    { bg1: "#45305e", bg2: "#1e1530", glow: "#a680d0", text: "#fff" },
  dragon:   { bg1: "#4620a0", bg2: "#1e0e48", glow: "#a070ff", text: "#fff" },
  dark:     { bg1: "#453829", bg2: "#1e1810", glow: "#a09080", text: "#fff" },
  steel:    { bg1: "#70708a", bg2: "#32323e", glow: "#d0d0e8", text: "#fff" },
  fairy:    { bg1: "#8c4870", bg2: "#3d1e30", glow: "#f0a0d0", text: "#fff" },
};

export const GENERATIONS = [
  { id: 1, region: "Kanto", from: 1, to: 151 },
  { id: 2, region: "Johto", from: 152, to: 251 },
  { id: 3, region: "Hoenn", from: 252, to: 386 },
  { id: 4, region: "Sinnoh", from: 387, to: 493 },
  { id: 5, region: "Unova", from: 494, to: 649 },
  { id: 6, region: "Kalos", from: 650, to: 721 },
  { id: 7, region: "Alola", from: 722, to: 809 },
  { id: 8, region: "Galar", from: 810, to: 905 },
  { id: 9, region: "Paldea", from: 906, to: 1025 },
];

export const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

/** Maximum reasonable stat value for radar chart scaling */
export const STAT_MAX = 180;

export const TYPE_NAMES = Object.keys(TYPE_COLORS);
