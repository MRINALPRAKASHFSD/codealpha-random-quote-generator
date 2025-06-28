import React from "react";
function SearchBar({ search, setSearch, close }) {
  return (
    <div className="modal search-modal">
      <input
        autoFocus
        className="search-input"
        type="text"
        placeholder="Search quotes or authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && close()}
      />
      <button onClick={close} className="close-btn" title="Close">✖</button>
    </div>
  );
}
export default SearchBar;