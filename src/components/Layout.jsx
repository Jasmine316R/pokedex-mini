import { Outlet, Link, NavLink } from "react-router-dom";
import { usePokedex } from "../context/pokedex.js";

function Layout() {
  const { theme, toggleTheme, favorites } = usePokedex();

  return (
    <div className="app">
      <div className="backdrop" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
      <header className="app-header">
        <Link to="/" className="app-title-link">
          <span className="pokeball-mark" aria-hidden="true" />
          <h1>PokéDex Mini</h1>
        </Link>
        <nav className="app-nav">
          <NavLink to="/" end>
            Browse
          </NavLink>
          <NavLink to="/play">Who's that?</NavLink>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === "night" ? "Day" : "Night"}
          </button>
        </nav>
        <p className="caught-count">{favorites.length} caught</p>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
