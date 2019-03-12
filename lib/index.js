const chokidar = require('chokidar');
const appRoot = require('app-root-path');
const log = require('./log');

function serveHot(watchPath = appRoot.path, options) {
  log(`Watching ${watchPath}`);

  // TODO: add option to watch node_modules directory, but disable by default
  if (options.nodeModules) {
    // no-op
  }

  const watcher = chokidar.watch(watchPath);

  watcher.on('ready', () => {
    watcher.on('all', () => {
      log('Module cache cleared');

      // FIXME: the regex below is hard-coded, but should be `watchPath`
      Object.keys(require.cache).forEach((id) => {
        if (/[/\\]server[/\\]/.test(id)) delete require.cache[id];
      });
    });
  });
}

module.exports = serveHot;
