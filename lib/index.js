const chokidar = require('chokidar');
const appRoot = require('app-root-path');
const log = require('./log');

function serveHot(watchPath = appRoot.path) {
  log(`is watching ${watchPath}`);

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
