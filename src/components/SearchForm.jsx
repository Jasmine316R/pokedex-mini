import { useState } from "react";

function SearchForm({ query, onQueryChange, onSubmitName }) {
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const name = query.trim().toLowerCase();
    if (name === "") {
      setError("Type a Pokémon name first.");
      return;
    }
    setError(null);
    onSubmitName(name);
  }

  return (
    <div className="search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setError(null);
            onQueryChange(event.target.value);
          }}
          placeholder="Filter the grid, or search any name…"
          className="search-input"
          aria-label="Search Pokémon"
        />
        <button type="submit" className="search-button">
          Open
        </button>
      </form>
      {error && <p className="status status-error">{error}</p>}
    </div>
  );
}

export default SearchForm;
