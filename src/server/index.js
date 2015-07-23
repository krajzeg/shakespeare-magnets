let path = require('path');
let http = require('http');
let express = require('express');
let ws = require('ws');

let UnisonWebSocketServer = require('unison-websocket-server');

module.exports = setupExpressApp();

export default function setupServer() {
  let app = setupExpressApp();

  let httpServer = http.createServer(app);
  let wsServer = new ws.Server({server: httpServer});
  let unisonApp = setupUnisonServer(wsServer);

  return httpServer;
}

function setupExpressApp() {
  let app = express();

  app.engine('hjs', require('consolidate').hogan);
  app.set('views', path.join(process.cwd(), 'views'));
  app.set('view engine', 'hjs');

  // static files served
  let publicFilesPath = path.join(process.cwd(), 'public');
  let compiledScriptsPath = path.join(process.cwd(), 'dist/browser');
  app.use('/scripts', express.static(compiledScriptsPath));
  app.use('/public', express.static(publicFilesPath));

  // actual pages
  app.get('/', require('./routes/main'));

  return app;
}

function setupUnisonServer(wsServer) {
  let unison = require('unison');
  let UnisonWSServer = require('unison-websocket-server');
  let magnets = require('../magnets');

  let $$ = unison({});
  $$.plugin(unison.server({
      communication: new UnisonWSServer(wsServer),
      commands: magnets.commands,
      intents: magnets.intents
    }));
  magnets.setupState($$);

  return $$;
}
