const fire = require('emoji-fire');

function log(message) {
  // eslint-disable-next-line no-console
  console.log(`${fire}  served-hot ${message}`);
}

module.exports = log;
