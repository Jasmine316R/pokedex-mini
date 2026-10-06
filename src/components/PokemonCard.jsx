import { useState } from "react";
import { Link } from "react-router-dom";
import { TYPE_COLORS } from "../data/constants.js";
import { capitalize, getArtworkUrl, padId } from "../utils.js";
import { usePokedex } from "../context/pokedex.js";
import TypeBadge from "./TypeBadge.jsx";

function PokemonCard({ id, name, types = [] }) {
  const { isFavorite, toggleFavorite } = usePokedex();
  const caught = isFavorite(name);
  const accent = TYPE_COLORS[types[0]] || "#ff5350";
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <li className="pokemon-card-wrap">
      <article className="pokemon-card glass-card" style={{ "--accent": accent }}>
        <button
          type="button"
          className={`catch-btn ${caught ? "is-caught" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite(name);
          }}
          aria-label={caught ? `Release ${name}` : `Catch ${name}`}
          title={caught ? "Release" : "Catch"}
        >
          {caught ? "●" : "○"}
        </button>
        <Link to={`/pokemon/${name}`} className="pokemon-card-link">
          <div className="pokemon-card-art">
            {/* Skeleton placeholder while image loads */}
            {!imgLoaded && <div className="card-img-skeleton" aria-hidden="true" />}
            <img
              src={getArtworkUrl(id)}
              alt=""
              width={140}
              height={140}
              loading="lazy"
              className={imgLoaded ? "is-loaded" : "is-loading"}
              onLoad={() => setImgLoaded(true)}
            />
          </div>
          <span className="pokemon-id">#{padId(id)}</span>
          <h3 className="pokemon-name">{capitalize(name)}</h3>
          <p className="pokemon-card-types">
            {types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </p>
        </Link>
      </article>
    </li>
  );
}

export default PokemonCard;
