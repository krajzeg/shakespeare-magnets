let path = require('path');
let express = require('express');

module.exports = setupApp();

function setupApp() {
  let app = express();

  app.engine('hjs', require('consolidate').hogan);
  app.set('views', path.join(process.cwd(), 'views'));
  app.set('view engine', 'hjs');

  // static files served
  let compiledScriptsPath = path.join(process.cwd(), 'dist/browser');
  app.use('/scripts', express.static(compiledScriptsPath));

  // actual pages
  app.get('/', require('./routes/main'));

  return app;
}