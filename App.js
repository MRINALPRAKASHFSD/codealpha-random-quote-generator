// src/App.js
import React, { useState } from "react";
import quotes from "./quotes";
import "./App.css";

function getRandomIndex(exclude) {
  let idx;
  do {
    idx = Math.floor(Math.random() * quotes.length);
  } while (idx === exclude && quotes.length > 1);
  return idx;
}

export default function App() {
  const [index, setIndex] = useState(getRandomIndex());

  const handleNewQuote = () => {
    setIndex(getRandomIndex(index));
  };

  const quote = quotes[index];

  return (
    <div className="quote-app">
      <div className="quote-box">
        <blockquote>
          <span className="quote-mark">“</span>
          {quote.text}
          <span className="quote-mark">”</span>
        </blockquote>
        <p className="author">- {quote.author}</p>
        <button className="new-quote-btn" onClick={handleNewQuote}>
          New Quote
        </button>
      </div>
      <footer>
        <small>Random Quote Generator &copy; 2025</small>
      </footer>
    </div>
  );
}