const base32h = require('../base32h_original');
const optimized = require('../../base32h');
const { measure } = require('../measure');

module.exports = function benchmarkEncodeBin(context) {
  return measure('encodeBin',
    context,
    function* data() {
      const TIMES = 50_000;
      const inputs = [
        [255], [255,255,255], [255,255], [255,255,255,255], [255,255,255,255,255],
        [255, 255,255,255,255,255], [255,255,255,255,255, 255,255,255,255,255],
        "hello", "goodbye", "trees", "seed", "i", "eye", "ay",
      ];
      for(let idx=0; idx < TIMES; idx++) {
        yield inputs[idx % inputs.length]
      }
    },
    function original(value) {
      return base32h.encodeBin(value);
    },
    function testing(value) {
      return optimized.encodeBin(value);
    },
  );
}

