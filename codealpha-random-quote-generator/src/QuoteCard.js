import React, { useState, useRef } from "react";

function getSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function QuoteCard({
  quote,
  isFavorite,
  onToggleFavorite,
  onPrev,
  onNext,
  canPrev,
  canNext,
  theme,
  highContrast,
  largeFont
}) {
  const [tts, setTts] = useState(false);
  const [imgDownloading, setImgDownloading] = useState(false);
  const cardRef = useRef();

  // Text-to-speech
  function speakQuote() {
    if (!getSpeechSupported()) return;
    setTts(true);
    const utter = new window.SpeechSynthesisUtterance(
      `"${quote.quote}" by ${quote.author}`
    );
    utter.onend = () => setTts(false);
    utter.onerror = () => setTts(false);
    window.speechSynthesis.speak(utter);
  }

  // Export as image
  async function exportImage() {
    if (!window.html2canvas) {
      alert("Image export requires html2canvas library. Please add it.");
      return;
    }
    setImgDownloading(true);
    const canvas = await window.html2canvas(cardRef.current, {
      backgroundColor: null,
      scale: 2
    });
    const url = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = url;
    link.download = `quote-${Date.now()}.png`;
    link.click();
    setImgDownloading(false);
  }

  // Google Translate (multi-lingual)
  const translateURL = `https://translate.google.com/?sl=auto&tl=hi&text=${encodeURIComponent(
    `"${quote.quote}" — ${quote.author}`
  )}&op=translate`;

  // Share URLs
  const quoteText = `"${quote.quote}" — ${quote.author}`;
  const xURL = `https://x.com/intent/tweet?text=${encodeURIComponent(
    quoteText
  )}`;
  const whatsappURL = `https://wa.me/?text=${encodeURIComponent(quoteText)}`;

  return (
    <div
      className={`quote-box`}
      ref={cardRef}
      tabIndex={-1}
      style={{
        fontSize: largeFont ? "1.25em" : undefined,
        border: highContrast ? "3px solid #f9d423" : undefined
      }}
    >
      <span className="quote-icon" aria-label="quote">❝</span>
      <p className="quote">{quote.quote}</p>
      <p className="author">- {quote.author}</p>
      <div className="button-row">
        <button className="button" onClick={onPrev} disabled={!canPrev} title="Previous quote">
          ◀
        </button>
        <button className="button" onClick={onNext} disabled={!canNext} title="Next quote">
          ▶
        </button>
        <button
          className={`fav-btn-2${isFavorite ? " active" : ""}`}
          onClick={onToggleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
        <button className="share-btn" onClick={speakQuote} disabled={tts} title="Speak quote">
          🗣️
        </button>
        <button className="share-btn" onClick={exportImage} disabled={imgDownloading} title="Download as image">
          📸
        </button>
        <a
          className="share-btn"
          href={xURL}
          target="_blank"
          rel="noopener noreferrer"
          title="Share this quote on X"
        >
          {/* X logo SVG */}
          <svg width="22" height="22" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="1200" height="1227" rx="240" fill="#000"/>
            <path d="M880 264H1014L714 617L1062 962H861L641 741L398 1052H264L579 664L242 264H449L648 479L880 264ZM843 891H910L509 335H438L843 891Z" fill="#fff"/>
          </svg>
        </a>
        <a
          className="share-btn"
          href={whatsappURL}
          target="_blank"
          rel="noopener noreferrer"
          title="Share this quote on WhatsApp"
        >
          {/* WhatsApp logo SVG */}
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#25D366"/>
            <path d="M22.4 18.67c-.34-.17-2-1-2.32-1.12-.31-.12-.54-.17-.77.17-.23.34-.88 1.12-1.07 1.34-.2.23-.39.26-.73.09-.34-.17-1.44-.53-2.74-1.68-1.01-.9-1.7-2-1.91-2.34-.2-.34-.02-.52.15-.69.16-.16.34-.4.51-.6.17-.2.22-.34.34-.56.12-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.06-2.56-.28-.68-.57-.59-.77-.6-.2-.01-.43-.01-.67-.01-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.85 0 1.68 1.23 3.31 1.4 3.54.17.22 2.43 3.7 5.89 5.02.82.32 1.46.51 1.96.65.82.23 1.58.2 2.17.12.66-.1 2.02-.83 2.3-1.62.28-.8.28-1.48.2-1.62-.08-.13-.3-.21-.64-.37z" fill="#fff"/>
          </svg>
        </a>
        <a
          className="share-btn"
          href={translateURL}
          target="_blank"
          rel="noopener noreferrer"
          title="Translate quote (Google Translate)"
        >
          🌐
        </a>
      </div>
    </div>
  );
}
export default QuoteCard;