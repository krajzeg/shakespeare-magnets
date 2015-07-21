let unison = require('unison');
let client = require('unison/dist/lib/plugins/client');
let WebsocketComm = require('unison-websocket-browser');

let serverUrl = window.location.toString().replace(/https?/, 'ws');

let state = window.$$ = unison({})
  .plugin(client({
    communication: new WebsocketComm(serverUrl, {debug: true}),
    commands: require('../magnets/commands'),
    intents: require('../magnets/intents')
  }));

class Magnet {
  static initialize() {
    $$('magnets').on('childAdded', (id) => {
      new Magnet($$('magnets').child(id));
    });
  }

  constructor($$magnet) {
    this.node = $$magnet;
    this.$div = this.createElement();
    this.update();

    $$magnet.on('updated', () => { this.update(); });
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

    return $elem;
  }

  update() {
    let state = this.node.state();
    this.$div
      .html(state.word)
      .css({
        left: state.x + "vh",
        top:  state.y + "vh"
      });
  }

  attemptMove() {
    let {left, top} = this.$div.position()
    let leftInVh = left * 100 / $('#magnets').height();
    let topInVh = top * 100 / $('#magnets').height();

    this.node.pleaseMoveTo(leftInVh, topInVh);
  }
}

Magnet.initialize();

