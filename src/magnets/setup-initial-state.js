let _ = require('lodash');
let randomWord = require('./random-word');

export default function setupInitialState($$) {
  $$('').add('magnets', {});

  _.each(_.range(0, 100), () => {
    $$('magnets').add(randomMagnet());
  });
}

function randomMagnet() {
  return {
    x: randomFloat(10, 90), y: randomFloat(10, 90),
    word: randomWord()
  }
}

function randomFloat(low, high) {
  return Math.random() * (high - low) + low;
}
