const path = require('path');
const chokidar = require('chokidar');

function hot(watchPath) {
  const serverDir = path.join(__dirname, '../../');
  const watcher = chokidar.watch(serverDir);

  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Server module cache cleared');

      Object.keys(require.cache).forEach((id) => {
        if (/[/\\]server[/\\]/.test(id)) delete require.cache[id];
      });
    });
  });
}

module.exports = hot;