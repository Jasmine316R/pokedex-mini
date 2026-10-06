import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm.jsx";
import PokemonList from "../components/PokemonList.jsx";
import { GENERATIONS, TYPE_NAMES } from "../data/constants.js";
import { capitalize } from "../utils.js";

function ListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [generation, setGeneration] = useState(GENERATIONS[0]);
  const [typeFilter, setTypeFilter] = useState(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  function surprise() {
    const id =
      Math.floor(Math.random() * (generation.to - generation.from + 1)) +
      generation.from;
    navigate(`/pokemon/${id}`);
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Field notes</p>
        <h2>Browse, catch, and quiz yourself.</h2>
        <p className="hero-copy">
          Flip through every region, filter by type, catch your favorites, or
          jump into a random encounter.
        </p>
        <div className="hero-actions">
          <button type="button" className="search-button" onClick={surprise}>
            Surprise me
          </button>
          <button
            type="button"
            className={`chip ${favoritesOnly ? "is-on" : ""}`}
            onClick={() => setFavoritesOnly((v) => !v)}
          >
            {favoritesOnly ? "Showing caught" : "Caught only"}
          </button>
        </div>
      </section>

      <SearchForm
        query={query}
        onQueryChange={setQuery}
        onSubmitName={(name) => navigate(`/pokemon/${name}`)}
      />

      <div className="gen-row" role="tablist" aria-label="Generations">
        {GENERATIONS.map((gen) => (
          <button
            key={gen.id}
            type="button"
            role="tab"
            aria-selected={generation.id === gen.id}
            className={`chip ${generation.id === gen.id ? "is-on" : ""}`}
            onClick={() => setGeneration(gen)}
          >
            {gen.region}
          </button>
        ))}
      </div>

      <div className="type-row" aria-label="Filter by type">
        <button
          type="button"
          className={`chip ${typeFilter === null ? "is-on" : ""}`}
          onClick={() => setTypeFilter(null)}
        >
          All types
        </button>
        {TYPE_NAMES.map((type) => (
          <button
            key={type}
            type="button"
            className={`chip chip-type ${typeFilter === type ? "is-on" : ""}`}
            data-type={type}
            onClick={() => setTypeFilter((current) => (current === type ? null : type))}
          >
            {capitalize(type)}
          </button>
        ))}
      </div>

      <PokemonList
        generation={generation}
        query={query}
        typeFilter={typeFilter}
        favoritesOnly={favoritesOnly}
      />
    </>
  );
}

export default ListPage;
