const base32h = require('../base32h_original');
const optimized = require('../../base32h');
const { measure } = require('../measure');

module.exports = function benchmarkEncodeDigit(context) {
  return measure('encodeDigit',
    context,
    function* data() {
      const TIMES = 100_000;
      for(let idx=0; idx < TIMES; idx++) {
        yield idx % 32;
      }
    },
    function original(value) {
      return base32h.encodeDigit(value);
    },
    function testing(value) {
      return optimized.encodeDigit(value);
    },
  );
}

