import { HashRouter, Routes, Route } from "react-router-dom";
import { PokedexProvider } from "./context/PokedexContext.jsx";
import Layout from "./components/Layout.jsx";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <PokedexProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ListPage />} />
            <Route path="/play" element={<GamePage />} />
            <Route path="/pokemon/:name" element={<DetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </PokedexProvider>
  );
}

export default App;
