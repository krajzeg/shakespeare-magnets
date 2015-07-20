let unison = require('unison');
let client = require('unison/dist/lib/plugins/client');
let WebsocketComm = require('unison-websocket-browser');

let serverUrl = window.location.toString().replace(/https?/, 'ws');

let state = window.$$ = unison({})
  .plugin(client({
    communication: new WebsocketComm(serverUrl, {debug: true}),
    commands: {},
    intents: {}
  }));

