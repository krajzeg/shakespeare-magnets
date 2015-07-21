let _ = require('lodash');

const LETTERS = "abcdefghijklmnopqrstuvwxyzaeiou";

export default function setupInitialState($$) {
  $$('').add('magnets', {});

  _.each(_.range(0, 100), () => {
    $$('magnets').add(randomMagnet());
  });
}

function randomInt(low, high) {
  return Math.floor(randomFloat(low, high));
}

function randomFloat(low, high) {
  return Math.random() * (high - low) + low;
}

function randomMagnet() {
  return {
    x: randomFloat(10, 90), y: randomFloat(10, 90),
    word: LETTERS[randomInt(0, LETTERS.length)]
  }
}