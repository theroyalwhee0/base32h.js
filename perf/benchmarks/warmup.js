const base32h = require('../base32h_original');
const optimized = require('../../base32h');
const { measure } = require('../measure');

module.exports = function benchmarkEncode(context) {
  return measure('warmup',
    context,
    function* data() {
      const TIMES = 10_000;
      for(let idx=0; idx < TIMES; idx++) {
        yield idx % 7;
      }
    },
    function original(value) {
      return value * 3;
    },
    function testing(value) {
      return value + value + value;
    },
  );
}

