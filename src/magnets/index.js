let _ = require('lodash');

module.exports = {
  setupState(u) {
    u('').add('magnets', {});
    _.each(_.range(0, 80), () => {
      u('magnets').add(randomMagnet());
    });
  },

  commands: {
    moveTo(x, y) {
      this.update({x: x, y: y});
    },

    changeWord(word) {
      this.update({word: word});
    }
  },

  intents: {
    pleaseMoveTo(x, y) {
      this.moveTo(x, y);
    },

    pleaseRandomize() {
      let randomWord = require('./random-word');
      this.changeWord(randomWord());
    }
  }
};

function randomMagnet() {
  let randomWord = require('./random-word');
  return {
    x: randomFloat(0, 90), y: randomFloat(0, 90),
    word: randomWord()
  }
}

function randomFloat(low, high) {
  return Math.random() * (high - low) + low;
}
