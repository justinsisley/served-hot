const fire = require('emoji-fire');

function log(message) {
  // eslint-disable-next-line no-console
  console.log(`\n${fire} served-hot: ${message}\n`);
}

module.exports = log;
