/**
 * Imports.
 */
const { PerformanceObserver, performance } = require('perf_hooks');
const { start } = require('repl');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Measure 'targets' given data iterable.
 */
async function measure(title, context, data, ...targets) {
  const measurement = context.measurements[title] = context.measurements[title] || {
    title,
    rounds: 0,
    items: {
    }
  };
  const obs = new PerformanceObserver((items) => {
    for(let entry of items.getEntries()) {
      const item = measurement.items[entry.name];
      item.count += 1;
      item.totalDuration += entry.duration
      item.avgDuration = item.totalDuration/item.count;
      if(item.highDuration < entry.duration) {
        item.highDuration = entry.duration;
      }
      if(item.lowDuration > entry.duration) {
        item.lowDuration = entry.duration;
      }
    }
    performance.clearMarks();
  });
  obs.observe({ entryTypes: ['measure'] });
  if(context.idx % 2 === 1) {
    // Reverse order each round.
    targets.reverse();
  }
  measurement.rounds += 1;
  for(let target of targets) {
    const it = data();
    const name = target.name;
    measurement.items[name] = measurement.items[name] || {
      count: 0,
      totalDuration: 0,
      avgDuration: undefined,
      highDuration: Number.NEGATIVE_INFINITY,
      lowDuration: Number.POSITIVE_INFINITY,
    };
    await sleep(50);
    let idx = 0;
    for(let value of it) {
      if(idx % 100_000 === 0) {
        global.gc && global.gc();
      }
      performance.mark(`start:${name}:${idx}`);
      target(value, idx);
      performance.mark(`end:${name}:${idx}`);
      performance.measure(name, `start:${name}:${idx}`, `end:${name}:${idx}`);
      idx += 1;
    }
    await sleep(50);
  }
  obs.disconnect();
}

/**
 * Exports.
 */
module.exports = {
  measure,
};
