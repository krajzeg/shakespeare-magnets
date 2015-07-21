let unison = require('unison');
let client = require('unison/dist/lib/plugins/client');
let WebsocketComm = require('unison-websocket-browser');

let serverUrl = window.location.toString().replace(/https?/, 'ws');

let state = window.$$ = unison({})
  .plugin(client({
    communication: new WebsocketComm(serverUrl),
    commands: {},
    intents: {}
  }));

$$('').on('childAdded', (id) => { console.log("Root got a child - " + id)})
$$('magnets').on('childAdded', (id) => { console.log("Magnets got a child - " + id)})
$$('magnets.1').on('created', () => { console.log("Hi there!")});

class Magnet {
  static initialize() {
    console.log("Magnets initialized!");
    $$('magnets').on('childAdded', (id) => {
      console.log("Woah, a magnet!");
      new Magnet($$('magnets').child(id));
    });
  }

  constructor($$magnet) {
    this.node = $$magnet;
    this.$div = this.createElement();
    this.update();

    $$magnet.on('changed', () => { this.update(); });
  }

  createElement() {
    let $elem = $("<div class='magnet'></div>");
    $elem.appendTo($('body'));
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
}

Magnet.initialize();

