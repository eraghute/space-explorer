import { Link, Route, Routes } from "react-router-dom";
import Explore from "./pages/Explorer";
import Apod from "./pages/Apod";
import { useState } from "react";
import Epic from "./pages/Epic";

function App() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme") === "dark"
      : true,
  );
  function setTheme(isDark: boolean) {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setIsDark(isDark);
  }
  return (
    <div className={`space-app ${isDark ? "dark-theme" : "light-theme"}`}>
      <nav className="navbar space-navbar">
        <div className="container py-2">
          <Link
            to="/"
            className="navbar-brand fw-semibold text-decoration-none"
          >
            🚀 <span className="brand-text">Space Explorer</span>
          </Link>

          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-sm btn-light px-3">
              Explore
            </Link>

            <Link to="/apod" className="btn btn-sm btn-light px-3">
              NASA APOD
            </Link>

            <Link to="/epic" className="btn btn-sm btn-light px-3">
              Earth Imagery
            </Link>
            <button className="btn btn-light" onClick={() => setTheme(!isDark)}>
              {isDark ? "☀️ Switch to Light" : "🌙 Switch to Dark"}
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/apod" element={<Apod />} />
        <Route path="/epic" element={<Epic />} />
      </Routes>
    </div>
  );
}
export default App;
