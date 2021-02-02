const base32h = require('../base32h_original');
const optimized = require('../../base32h');
const { measure } = require('../measure');

module.exports = function benchmarkEncode(context) {
  return measure('decode',
    context,
    function* data() {
      const inputs = [
        '0', '1', 'Q9', 'Z8', '31M0', '9H5L0', '4000000',
        '8000000', '100000000', '8000000000', '80000000000',
        'Z', 'ZZ', 'ZZZZ', 'ZZZZZZZZ', '7Z', '1ZZZ', '3ZZZZZZ',
      ];
      const TIMES = 50_000;
      for(let idx=0; idx < TIMES; idx++) {
        yield inputs[idx % inputs.length];
      }
    },
    function original(value) {
      return base32h.decode(value);
    },
    function testing(value) {
      return optimized.decode(value);
    },
  );
}

