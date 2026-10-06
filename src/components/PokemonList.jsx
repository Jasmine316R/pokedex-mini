import { useEffect, useMemo, useState } from "react";
import PokemonCard from "./PokemonCard.jsx";
import { fetchPokemonList, loadTypeMap } from "../api/pokemon.js";
import { getIdFromUrl } from "../utils.js";
import { usePokedex } from "../context/pokedex.js";

function PokemonList({ generation, query, typeFilter, favoritesOnly }) {
  const { favorites } = usePokedex();
  const [pokemons, setPokemons] = useState([]);
  const [typeMap, setTypeMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [results, types] = await Promise.all([
          fetchPokemonList(generation.from, generation.to),
          loadTypeMap(),
        ]);
        if (isCurrent) {
          setPokemons(results);
          setTypeMap(types);
        }
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    load();
    return () => {
      isCurrent = false;
    };
  }, [generation, retryCount]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pokemons.filter((pokemon) => {
      const types = typeMap[pokemon.name] || [];
      if (q && !pokemon.name.includes(q) && !String(getIdFromUrl(pokemon.url)).includes(q)) {
        return false;
      }
      if (typeFilter && !types.includes(typeFilter)) return false;
      if (favoritesOnly && !favorites.includes(pokemon.name)) return false;
      return true;
    });
  }, [pokemons, query, typeFilter, favoritesOnly, favorites, typeMap]);

  /* ─── Skeleton loading with card-shaped placeholders ─── */
  if (isLoading) {
    return (
      <ul className="pokemon-grid" aria-busy="true" aria-label="Loading Pokémon">
        {Array.from({ length: 12 }, (_, i) => (
          <li key={i} className="skeleton-card glass-card" aria-hidden="true">
            <div className="skel-card-art" />
            <div className="skel-card-body">
              <span className="skel-line" style={{ width: 60 }} />
              <span className="skel-line skel-title" style={{ width: "80%" }} />
              <div className="skel-badge-row">
                <span className="skel-badge" />
                <span className="skel-badge" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <div className="status">
        <p className="status-error">Couldn't load the list: {error}</p>
        <button
          type="button"
          className="search-button"
          onClick={() => setRetryCount((c) => c + 1)}
          style={{ marginTop: 12 }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <p className="status">
        {favoritesOnly
          ? "No caught Pokémon in this region yet. Tap the circle on a card to catch one."
          : "No Pokémon match those filters."}
      </p>
    );
  }

  return (
    <ul className="pokemon-grid">
      {visible.map((pokemon) => {
        const id = getIdFromUrl(pokemon.url);
        return (
          <PokemonCard
            key={pokemon.name}
            id={id}
            name={pokemon.name}
            types={typeMap[pokemon.name] || []}
          />
        );
      })}
    </ul>
  );
}

export default PokemonList;
