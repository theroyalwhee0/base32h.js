const base32h = require('../base32h_original');
const optimized = require('../../base32h');
const { measure } = require('../measure');

module.exports = function benchmarkDecodeDigit(context) {
  return measure('decodeDigit',
    context,
    function* data() {
      const TIMES = 100_000;
      const inputs = '0123456789ABCDEFGHJKLMNPQRTVWXYZ';
      for(let idx=0; idx < TIMES; idx++) {
        yield inputs[idx % inputs.length];
      }
    },
    function original(value) {
      return base32h.decodeDigit(value);
    },
    function testing(value) {
      return optimized.decodeDigit(value);
    },
  );
}

