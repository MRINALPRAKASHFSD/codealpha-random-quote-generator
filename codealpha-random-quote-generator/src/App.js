import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import quotesList from "./quotes";
import "./App.css";
import ParticleBackground from "./ParticleBackground";
import QuoteCard from "./QuoteCard";
import SearchBar from "./SearchBar";
import AddQuoteModal from "./AddQuoteModal";
import FavoritesModal from "./FavoriteModal";
import { getQuoteColorHash, getRandomIndex, getDailyQuoteIndex } from "./quoteUtils";

const LOCAL_FAV_KEY = "quoteapp_favorites";
const LOCAL_CUSTOM_KEY = "quoteapp_custom";

function App() {
  // Combine built-in and user-added quotes
  const [customQuotes, setCustomQuotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_CUSTOM_KEY)) || [];
    } catch {
      return [];
    }
  });
  const allQuotes = [...quotesList, ...customQuotes];

  // Load favorites
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_FAV_KEY)) || [];
    } catch {
      return [];
    }
  });

  // Modes: "random", "daily"
  const [mode, setMode] = useState("daily"); // Show daily quote first

  // Quote navigation/history
  const [history, setHistory] = useState(() =>
    mode === "daily" ? [getDailyQuoteIndex(allQuotes.length)] : []
  );
  const [historyIdx, setHistoryIdx] = useState(0);

  // Search/filter
  const [search, setSearch] = useState("");
  const filteredQuotes = search
    ? allQuotes.filter(
        (q) =>
          q.quote.toLowerCase().includes(search.toLowerCase()) ||
          q.author.toLowerCase().includes(search.toLowerCase())
      )
    : allQuotes;
  const [searchMode, setSearchMode] = useState(false);

  // Modal states
  const [showAdd, setShowAdd] = useState(false);
  const [showFav, setShowFav] = useState(false);

  // Theme, contrast, font size
  const [theme, setTheme] = useState(() =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);

  // Animated background color hash
  const currentIdx =
    searchMode && filteredQuotes.length
      ? history[historyIdx] ?? 0
      : history[historyIdx] ?? 0;
  const activeQuote =
    searchMode && filteredQuotes.length
      ? filteredQuotes[currentIdx % filteredQuotes.length]
      : allQuotes[currentIdx % allQuotes.length];

  // Animated background color based on quote
  const quoteBgHue = getQuoteColorHash(activeQuote);
  const [bgHue, setBgHue] = useState(quoteBgHue);

  // Animate hue shift on quote change
  useEffect(() => {
    setBgHue(quoteBgHue);
  }, [quoteBgHue]);

  // Save favorites & custom quotes
  useEffect(() => {
    localStorage.setItem(LOCAL_FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(LOCAL_CUSTOM_KEY, JSON.stringify(customQuotes));
  }, [customQuotes]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space" && !searchMode) nextQuote();
      if (e.code === "ArrowLeft") prevQuote();
      if (e.code === "ArrowRight") nextQuote();
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        setSearchMode(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [historyIdx, history, searchMode]);

  // Quote navigation
  function nextQuote() {
    if (searchMode && filteredQuotes.length > 0) {
      setHistory((h) =>
        h.concat([getRandomIndex(filteredQuotes.length, h[h.length - 1])])
      );
      setHistoryIdx((idx) => idx + 1);
    } else if (!searchMode) {
      setHistory((h) =>
        h.concat([getRandomIndex(allQuotes.length, h[h.length - 1])])
      );
      setHistoryIdx((idx) => idx + 1);
    }
  }
  function prevQuote() {
    if (historyIdx > 0) setHistoryIdx((idx) => idx - 1);
  }

  // Switch mode
  function switchMode() {
    if (mode === "daily") {
      setMode("random");
      setHistory([getRandomIndex(allQuotes.length)]);
      setHistoryIdx(0);
    } else {
      setMode("daily");
      setHistory([getDailyQuoteIndex(allQuotes.length)]);
      setHistoryIdx(0);
    }
  }

  // Add/Remove favorite
  function toggleFavorite(q) {
    setFavorites((favs) => {
      const idx = favs.findIndex(
        (fav) => fav.quote === q.quote && fav.author === q.author
      );
      if (idx === -1) return [...favs, q];
      return favs.filter((_, i) => i !== idx);
    });
  }

  // Add custom quote
  function addCustomQuote(q) {
    setCustomQuotes((prev) => [...prev, q]);
    setShowAdd(false);
    setHistory([allQuotes.length]);
    setHistoryIdx(0);
  }

  // Accessibility
  useEffect(() => {
    document.body.className =
      (theme === "dark" ? "dark-theme" : "light-theme") +
      (highContrast ? " high-contrast" : "") +
      (largeFont ? " large-font" : "");
  }, [theme, highContrast, largeFont]);

  // --- html2canvas Download Handler ---
  const handleDownloadAsImage = () => {
    const element = document.getElementById("capture");
    if (!element) return;
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "quote-card.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div
      className={`container ${theme}-theme`}
      style={{
        background: `hsl(${bgHue},100%,${theme === "dark" ? "14%" : "94%"})`,
        transition: "background 1.8s cubic-bezier(.6,.1,.5,1.2)"
      }}
    >
      {/* Animated Floating Circles & Particles */}
      <ParticleBackground hue={bgHue} theme={theme} />
      {/* --- BEGIN: Exportable Section --- */}
      <div id="capture">
        {/* Quote Card */}
        <QuoteCard
          quote={activeQuote}
          isFavorite={favorites.some(
            (f) =>
              f.quote === activeQuote.quote && f.author === activeQuote.author
          )}
          onToggleFavorite={() => toggleFavorite(activeQuote)}
          onPrev={prevQuote}
          onNext={nextQuote}
          canPrev={historyIdx > 0}
          canNext={true}
          theme={theme}
          highContrast={highContrast}
          largeFont={largeFont}
        />
      </div>
      {/* --- END: Exportable Section --- */}

      {/* Download Button */}
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <button
          onClick={handleDownloadAsImage}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 24px",
            fontSize: "1rem",
            cursor: "pointer",
            marginTop: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.11)"
          }}
        >
          Download as Image
        </button>
      </div>
      {/* Controls */}
      <div className="controls-bar">
        <button className="mode-btn" onClick={switchMode} title="Switch random/daily">
          {mode === "daily" ? "Random Mode" : "Daily Quote"}
        </button>
        <button className="fav-btn" onClick={() => setShowFav(true)} title="View favorites">
          ❤️
        </button>
        <button className="add-btn" onClick={() => setShowAdd(true)} title="Add custom quote">
          ＋
        </button>
        <button
          className="search-btn"
          onClick={() => setSearchMode((v) => !v)}
          title="Search"
        >
          🔍
        </button>
        <button className="theme-btn" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
          {theme === "dark" ? "🌞" : "🌙"}
        </button>
        <button className="contrast-btn" onClick={() => setHighContrast((v) => !v)}>
          {highContrast ? "🌈" : "🖤"}
        </button>
        <button className="font-btn" onClick={() => setLargeFont((v) => !v)}>
          {largeFont ? "A-" : "A+"}
        </button>
      </div>
      {/* Search Bar Modal */}
      {searchMode && (
        <SearchBar
          search={search}
          setSearch={setSearch}
          close={() => setSearchMode(false)}
        />
      )}
      {/* Add Quote Modal */}
      {showAdd && (
        <AddQuoteModal
          close={() => setShowAdd(false)}
          addQuote={addCustomQuote}
        />
      )}
      {/* Favorites Modal */}
      {showFav && (
        <FavoritesModal
          favorites={favorites}
          close={() => setShowFav(false)}
          onSelectQuote={(q) => {
            const idx = allQuotes.findIndex(
              (qq) => qq.quote === q.quote && qq.author === q.author
            );
            setHistory([idx]);
            setHistoryIdx(0);
            setShowFav(false);
          }}
        />
      )}
    </div>
  );
}

export default App;