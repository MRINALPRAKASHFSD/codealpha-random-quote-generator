import React from "react";
function FavoritesModal({ favorites, close, onSelectQuote }) {
  return (
    <div className="modal fav-modal">
      <h3>Your Favorites</h3>
      {favorites.length === 0 ? (
        <div>No favorites yet.</div>
      ) : (
        <ul>
          {favorites.map((q, i) => (
            <li key={i} onClick={() => onSelectQuote(q)} className="fav-item">
              <span>❝ {q.quote} ❞</span>
              <span style={{ display: "block", color: "#b6b" }}>— {q.author}</span>
            </li>
          ))}
        </ul>
      )}
      <button className="close-btn" onClick={close}>Close</button>
    </div>
  );
}
export default FavoritesModal;