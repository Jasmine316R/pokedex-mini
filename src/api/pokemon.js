import { API_BASE_URL } from "../config.js";
import { TYPE_NAMES } from "../data/constants.js";

const TYPE_MAP_KEY = "pokedex-type-map";

export async function fetchPokemonList(from, to) {
  const limit = to - from + 1;
  const offset = from - 1;
  const response = await fetch(
    `${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`);
  }
  const data = await response.json();
  return data.results;
}

export async function fetchPokemon(nameOrId) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`);
  if (!response.ok) {
    throw new Error(`No Pokémon named "${nameOrId}" — check the spelling.`);
  }
  return response.json();
}

export async function loadTypeMap() {
  try {
    const cached = sessionStorage.getItem(TYPE_MAP_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    /* ignore */
  }

  const listRes = await fetch(`${API_BASE_URL}/type`);
  if (!listRes.ok) throw new Error("Couldn't load types.");
  const list = await listRes.json();
  const types = list.results.filter((t) => TYPE_NAMES.includes(t.name));

  const entries = await Promise.all(
    types.map(async (t) => {
      const res = await fetch(t.url);
      if (!res.ok) return [t.name, []];
      const data = await res.json();
      return [t.name, data.pokemon.map((p) => p.pokemon.name)];
    })
  );

  const map = {};
  for (const [type, names] of entries) {
    for (const name of names) {
      if (!map[name]) map[name] = [];
      map[name].push(type);
    }
  }

  try {
    sessionStorage.setItem(TYPE_MAP_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota */
  }

  return map;
}
