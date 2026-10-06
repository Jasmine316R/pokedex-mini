import { SPRITE_BASE_URL } from "./config.js";

export function getIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getSpriteUrl(id) {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export function getArtworkUrl(id) {
  return `${SPRITE_BASE_URL}/other/official-artwork/${id}.png`;
}

export function getShinyArtworkUrl(id) {
  return `${SPRITE_BASE_URL}/other/official-artwork/shiny/${id}.png`;
}

export function formatHeight(decimetres) {
  return `${(decimetres / 10).toFixed(1)} m`;
}

export function formatWeight(hectograms) {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

export function padId(id) {
  return String(id).padStart(4, "0");
}

export function pickRandom(list, count) {
  const copy = [...list];
  const picked = [];
  while (copy.length && picked.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(index, 1)[0]);
  }
  return picked;
}
