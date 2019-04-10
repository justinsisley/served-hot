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
  // Determine the directory that contains the calling JavaScript file
  const callingFilePath = stack()[1].getFileName();
  const callingFileParentDirectory = path.join(callingFilePath, '../');
  const fullRouterPath = path.join(callingFileParentDirectory, routerPath);

  let fullWatchPath = watchPath;
  if (fullWatchPath !== appRoot.path) {
    fullWatchPath = path.join(callingFileParentDirectory, fullWatchPath);
  }

  log(`is watching ${fullWatchPath}`);

  // Handle API endpoints in a "hot-reloading" friendly way by
  // requiring a fresh root router on every API request.
  app.use(rootPath, (req, res, next) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(fullRouterPath).default(req, res, next);
  });

  const watcher = chokidar.watch(fullWatchPath);
  const moduleRegex = new RegExp(fullWatchPath);

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
