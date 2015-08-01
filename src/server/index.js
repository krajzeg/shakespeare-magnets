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

  // static files served
  let publicFilesPath = path.join(process.cwd(), 'public');
  let compiledScriptsPath = path.join(process.cwd(), 'dist/browser');
  app.use('/scripts', express.static(compiledScriptsPath));
  app.use('/public', express.static(publicFilesPath));

  // actual page
  app.get('/', function(req, res) {
    res.sendFile(path.join(process.cwd(), 'views/index.html'));
  });

  return app;
}

function setupUnisonServer(wsServer) {
  let unison = require('unison');
  let UnisonWSServer = require('unison-websocket-server');
  let magnets = require('../magnets');

  let u = unison({});
  u.plugin(unison.server({
      communication: new UnisonWSServer(wsServer),
      commands: magnets.commands,
      intents: magnets.intents
    }));
  magnets.setupState(u);

  return u;
}
