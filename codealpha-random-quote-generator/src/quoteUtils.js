export function getRandomIndex(arrLength, exclude) {
  let idx;
  do {
    idx = Math.floor(Math.random() * arrLength);
  } while (idx === exclude && arrLength > 1);
  return idx;
}
export function getDailyQuoteIndex(len) {
  // One quote per day (UTC)
  const today = Math.floor(Date.now() / 8.64e7);
  return today % len;
}
export function getQuoteColorHash(q) {
  // Generate a hue from quote+author hash
  let str = (q.quote + q.author).toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 360;
  return hash;
}