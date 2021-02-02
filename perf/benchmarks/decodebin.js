const base32h = require('../base32h_original');
const optimized = require('../../base32h');
const { measure } = require('../measure');

module.exports = function benchmarkDecodeBin(context) {
  return measure('decodeBin',
    context,
    function* data() {
      const TIMES = 50_000;
      const inputs = [
        '7z', '1zZz', 'fZzZz', '3zZzZzZ', '7ZZZZZZZZZ', 'zZzZzZzZzZzZzZzZ',
      ];
      for(let idx=0; idx < TIMES; idx++) {
        yield inputs[idx % inputs.length]
      }
    },
    function original(value) {
      return base32h.decodeBin(value);
    },
    function testing(value) {
      return optimized.decodeBin(value);
    },
  );
}

