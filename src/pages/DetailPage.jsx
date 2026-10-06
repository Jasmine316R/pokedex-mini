import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPokemon } from "../api/pokemon.js";
import { STAT_LABELS, TYPE_COLORS, TYPE_THEME_COLORS } from "../data/constants.js";
import { usePokedex } from "../context/pokedex.js";
import TypeBadge from "../components/TypeBadge.jsx";
import StatRadar from "../components/StatRadar.jsx";
import TiltCard from "../components/TiltCard.jsx";
import SkeletonDetail from "../components/SkeletonDetail.jsx";
import {
  capitalize,
  formatHeight,
  formatWeight,
  getArtworkUrl,
  getShinyArtworkUrl,
  padId,
} from "../utils.js";

/** Cache for fetched Pokémon detail data */
const detailCache = new Map();

function DetailPage() {
  const { name } = useParams();
  return <PokemonDetail key={name} name={name} />;
}

function PokemonDetail({ name }) {
  const { isFavorite, toggleFavorite } = usePokedex();
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shiny, setShiny] = useState(false);

  /* ─── Audio Cries state ─── */
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cryAvailable, setCryAvailable] = useState(false);

  /* ─── Crossfade image state ─── */
  const [artLoaded, setArtLoaded] = useState(false);

  /* ─── Retry mechanism ─── */
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadPokemon() {
      setIsLoading(true);
      setError(null);
      setPokemon(null);
      setShiny(false);
      setArtLoaded(false);

      try {
        // Check cache first
        const cacheKey = name.toLowerCase();
        let data;
        if (detailCache.has(cacheKey)) {
          data = detailCache.get(cacheKey);
        } else {
          data = await fetchPokemon(name);
          detailCache.set(cacheKey, data);
        }

        if (isCurrent) {
          setPokemon(data);
          // Check cry availability
          const hasCry = Boolean(data?.cries?.latest || data?.cries?.legacy);
          setCryAvailable(hasCry);
        }
      } catch (err) {
        if (isCurrent) setError(err.message);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadPokemon();
    return () => {
      isCurrent = false;
      // Stop any playing audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [name, retryCount]);

  /* ─── Dynamic type-based theming ─── */
  useEffect(() => {
    if (!pokemon) return;

    const primaryType = pokemon.types[0]?.type?.name || "normal";
    const secondaryType = pokemon.types[1]?.type?.name || null;
    const theme = TYPE_THEME_COLORS[primaryType] || TYPE_THEME_COLORS.normal;
    const secondaryTheme = secondaryType
      ? TYPE_THEME_COLORS[secondaryType]
      : null;

    const root = document.documentElement;
    root.style.setProperty("--type-bg1", theme.bg1);
    root.style.setProperty("--type-bg2", secondaryTheme ? secondaryTheme.bg1 : theme.bg2);
    root.style.setProperty("--type-glow", theme.glow);
    root.style.setProperty("--type-accent", TYPE_COLORS[primaryType]);
    root.style.setProperty("--type-accent-2", secondaryType ? TYPE_COLORS[secondaryType] : theme.glow);
    root.classList.add("has-type-theme");

    return () => {
      root.classList.remove("has-type-theme");
      root.style.removeProperty("--type-bg1");
      root.style.removeProperty("--type-bg2");
      root.style.removeProperty("--type-glow");
      root.style.removeProperty("--type-accent");
      root.style.removeProperty("--type-accent-2");
    };
  }, [pokemon]);

  /* ─── Audio Cry handler ─── */
  const playCry = useCallback(() => {
    if (!pokemon) return;
    const url = pokemon?.cries?.latest || pokemon?.cries?.legacy;
    if (!url) return;

    // Stop any currently playing cry before starting a new one
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    const onEnd = () => setIsPlaying(false);
    const onError = () => setIsPlaying(false);

    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);

    setIsPlaying(true);
    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [pokemon]);

  /* ─── Shiny toggle with fallback ─── */
  const handleShinyToggle = useCallback(() => {
    setArtLoaded(false);
    setShiny((s) => !s);
  }, []);

  const handleArtError = useCallback(() => {
    // If shiny image fails to load, fall back to default
    if (shiny) {
      setShiny(false);
    }
  }, [shiny]);

  /* ─── Loading state ─── */
  if (isLoading) return <SkeletonDetail />;

  if (error) {
    return (
      <div className="status">
        <p className="status-error">{error}</p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <button
            type="button"
            className="search-button"
            onClick={() => setRetryCount((c) => c + 1)}
          >
            Retry
          </button>
          <Link to="/" className="back-link">
            ← Back to list
          </Link>
        </div>
      </div>
    );
  }

  const caught = isFavorite(pokemon.name);
  const art = shiny ? getShinyArtworkUrl(pokemon.id) : getArtworkUrl(pokemon.id);
  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = pokemon.id < 1025 ? pokemon.id + 1 : null;
  const primaryType = pokemon.types[0]?.type?.name || "normal";
  const accent = TYPE_COLORS[primaryType] || "#ff5350";

  return (
    <div className="detail-page">
      <div className="detail-nav">
        <Link to="/" className="back-link">
          ← Dex
        </Link>
        <div className="detail-pager">
          {prevId ? (
            <Link to={`/pokemon/${prevId}`}>#{padId(prevId)}</Link>
          ) : (
            <span />
          )}
          {nextId ? (
            <Link to={`/pokemon/${nextId}`}>#{padId(nextId)}</Link>
          ) : (
            <span />
          )}
        </div>
      </div>

      <section className="detail-hero glass-card">
        {/* 3D Tilt on the artwork */}
        <TiltCard className="detail-art-tilt">
          <div className="detail-art">
            <img
              key={art}
              src={art}
              alt={pokemon.name}
              width={280}
              height={280}
              className={`detail-art-img ${artLoaded ? "is-loaded" : ""}`}
              onLoad={() => setArtLoaded(true)}
              onError={handleArtError}
              loading="lazy"
            />
          </div>
        </TiltCard>

        <div className="detail-meta">
          <p className="pokemon-id">#{padId(pokemon.id)}</p>
          <h2>{capitalize(pokemon.name)}</h2>
          <p className="pokemon-card-types">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} />
            ))}
          </p>
          <dl className="fact-row">
            <div>
              <dt>Height</dt>
              <dd>{formatHeight(pokemon.height)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{formatWeight(pokemon.weight)}</dd>
            </div>
            <div>
              <dt>Abilities</dt>
              <dd>
                {pokemon.abilities
                  .map((a) => capitalize(a.ability.name.replaceAll("-", " ")))
                  .join(", ")}
              </dd>
            </div>
          </dl>
          <div className="detail-actions">
            {/* Catch / Release button */}
            <button
              type="button"
              className={`search-button ${caught ? "is-ghost" : ""}`}
              onClick={() => toggleFavorite(pokemon.name)}
              aria-label={caught ? `Release ${pokemon.name}` : `Catch ${pokemon.name}`}
            >
              {caught ? "Release" : "Catch"}
            </button>

            {/* Shiny toggle with state indicator */}
            <button
              type="button"
              className={`chip ${shiny ? "is-on" : ""}`}
              onClick={handleShinyToggle}
              aria-label={shiny ? "Show regular artwork" : "Show shiny artwork"}
              aria-pressed={shiny}
            >
              {shiny ? "✨ Shiny" : "✨ Regular"}
            </button>

            {/* Audio cry with playing/idle state */}
            <button
              type="button"
              className={`chip cry-btn ${isPlaying ? "is-playing" : ""}`}
              onClick={playCry}
              disabled={!cryAvailable}
              aria-label={
                !cryAvailable
                  ? "No cry available for this Pokémon"
                  : isPlaying
                  ? "Playing cry…"
                  : "Play cry"
              }
              title={!cryAvailable ? "No cry audio available" : isPlaying ? "Playing…" : "Play cry"}
            >
              {isPlaying ? "🔊 Playing…" : "🔈 Play cry"}
            </button>
          </div>
        </div>
      </section>

      {/* Stat Radar Chart replaces the old progress bars */}
      <StatRadar stats={pokemon.stats} accentColor={accent} />

      {/* Still show stat values in an accessible list below the radar */}
      <ul className="stat-list" aria-label="Base stat values">
        {pokemon.stats.map((s) => (
          <li key={s.stat.name}>
            <span className="stat-name">
              {STAT_LABELS[s.stat.name] || capitalize(s.stat.name)}
            </span>
            <div className="stat-bar">
              <span
                className="stat-bar-fill"
                style={{ width: `${Math.min(100, (s.base_stat / 180) * 100)}%` }}
              />
            </div>
            <span className="stat-value">{s.base_stat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DetailPage;
