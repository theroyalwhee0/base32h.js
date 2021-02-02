const base32h = require('../base32h_original');
const optimized = require('../../base32h');
const { measure } = require('../measure');

module.exports = function benchmarkEncodeDigit(context) {
  return measure('uint40ToBytes',
    context,
    function* data() {
      const TIMES = 100_000;
      for(let idx=100_000; idx < 100_000+TIMES; idx++) {
        yield idx;
      }
    },
    function original(value) {
      return base32h._private.uint40ToBytes(value);
    },
    function testing(value) {
      return optimized._private.uint40ToBytes(value);
    },
  );
}

