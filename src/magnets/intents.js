export function pleaseMoveTo(x, y) {
  console.log(`Intent received: pleaseMoveTo(${x},${y})`);
  this.moveTo(x, y);
}