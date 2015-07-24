let unison = require('unison');
let UnisonWS = require('unison-websocket-browser');
let magnets = require('../magnets');

let serverUrl = window.location.toString().replace(/https?/, 'ws');

let $$ = window.$$ = unison({});
$$.plugin(unison.views());
$$.plugin(unison.client({
  communication: new UnisonWS(serverUrl, {debug: true}),
  commands: magnets.commands,
  intents: magnets.intents
}));


$$('magnets').on('childAdded', (id) => {
  new Magnet($$('magnets').child(id));
});

class Magnet {
  constructor($$magnet) {
    this.node = $$magnet;
    this.$div = this.createElement();
    this.updated(); // fake update to create initial state

    $$magnet.watch(this)
  }

  createElement() {
    let $elem = $( "<div class='magnet'></div>");
    $elem.appendTo($('#magnets'));

    // drag & drop
    $elem.draggable({
      containment: "parent",
      start: () => {
        $elem.addClass('is-dragged');
      },
      stop: () => {
        $elem.removeClass('is-dragged');
        this.attemptMove();
      }
    });

    // randomizing
    $elem.dblclick(() => {
      this.node.pleaseRandomize();
    });

    return $elem;
  }

  updated() {
    let state = this.node.state();
    this.$div
      .html(state.word)
      .css({
        left: state.x + "%",
        top:  state.y + "%"
      });
  }

  attemptMove() {
    let {left, top} = this.$div.position();
    let leftInPct = left * 100 / $('#magnets').width();
    let topInPct = top * 100 / $('#magnets').height();

    this.node.pleaseMoveTo(leftInPct, topInPct);
  }
}
