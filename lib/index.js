const path = require('path');
const chokidar = require('chokidar');
const appRoot = require('app-root-path');
const stack = require('callsite');
const log = require('./log');

function serveHot(app, {
  rootPath = '/api',
  routerPath = './api/index.js',
  watchPath = appRoot.path,
} = {
  rootPath: '/api',
  routerPath: './api',
  watchPath: appRoot.path,
}) {
  log(`is watching ${watchPath}`);

  const callingFilePath = stack()[1].getFileName();
  const callingFileParentDirectory = path.join(callingFilePath, '../');
  const fullRouterPath = path.join(callingFileParentDirectory, routerPath);

  // Handle API endpoints in a "hot-reloading" friendly way by
  // requiring a fresh root router on every API request.
  app.use(rootPath, (req, res, next) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(fullRouterPath).default(req, res, next);
  });

  const watcher = chokidar.watch(watchPath);
  const moduleRegex = new RegExp(watchPath);

  const removeModuleFromCache = (id) => {
    if (moduleRegex.test(id)) delete require.cache[id];
  };

  watcher.on('ready', () => {
    watcher.on('all', () => {
      log('cleared the server module cache');

      Object.keys(require.cache).forEach(removeModuleFromCache);
    });
  });
}

module.exports = serveHot;
