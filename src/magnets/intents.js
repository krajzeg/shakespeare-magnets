export function pleaseMoveTo(x, y) {
  this.moveTo(x, y);
}

export function pleaseRandomize() {
  let randomWord = require('./random-word');
  this.changeWord(randomWord());
}
