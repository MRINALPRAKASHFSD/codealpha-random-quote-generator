import React, { useState } from "react";
function AddQuoteModal({ close, addQuote }) {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  return (
    <div className="modal add-modal">
      <h3>Add Your Own Quote</h3>
      <input
        className="add-input"
        placeholder="Quote"
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        maxLength={180}
      />
      <input
        className="add-input"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        maxLength={40}
      />
      <div style={{ marginTop: 10 }}>
        <button
          className="button"
          onClick={() => quote && author && addQuote({ quote, author })}
          disabled={!quote || !author}
        >
          Add
        </button>
        <button onClick={close} className="close-btn" style={{ marginLeft: 12 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
export default AddQuoteModal;