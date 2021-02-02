const base32h = require('../base32h_original');
const optimized = require('../../base32h');
const { measure } = require('../measure');

module.exports = function benchmarkEncode(context) {
  return measure('encode',
    context,
    function* data() {
      const TIMES = 50_000;
      for(let idx=0; idx < TIMES; idx++) {
        yield idx;
      }
    },
    function original(value) {
      return base32h.encode(value);
    },
    function testing(value) {
      return optimized.encode(value);
    },
  );
}

