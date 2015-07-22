let path = require('path');
let fs = require('fs');

var words = fs.readFileSync(path.join(process.cwd(), 'data/word-list.txt')).toString().split(" ");

export default function randomWord() {
  let index = Math.floor(Math.random() * words.length);
  return words[index];
}
