const fs = require('fs/promises');
const benchmarks = require('./benchmarks/all');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.info('[ Benchmarking for base32h ]');
  const context = {
    idx: 0,
    measurements: {},
  };
  const ROUNDS = 10;
  for(let round=0; round < ROUNDS; round++) {
    context.round = round;
    console.info(`> Round ${round+1} of ${ROUNDS}`);
    await sleep(20);
    for(let idx=0; idx < benchmarks.length; idx++) {
      const benchmark = benchmarks[idx];
      await benchmark(context);
      await sleep(5);
      global.gc && global.gc();
    }
    global.gc && global.gc();
    await sleep(20);
  }
  const report = createReport(context);
  const reportPath = './report.log';
  await writeReport(reportPath, report);
  console.log(`> Report: `, reportPath);
  console.info('> Done');
  process.exit();
}

main();


function writeReport(fileName, report) {
  const rows = [ report.headers ].concat(report.rows);
  const contents = rows.reduce((acc, value) => {
    acc.push(value.join(','));
    return acc;
  }, []).join('\n');
  return fs.writeFile(fileName, contents);
}

function createReport(context) {
  const { measurements } = context;
  const headers = [
      'name',
      'calls',
      'original:total',
      'testing:total',
      'original:high',
      'testing:high',
      'original:low',
      'testing:low',
      'original:avg',
      'testing:avg',
      'perfDiff',
    ].reduce((headers, value) => {
      headers.push(JSON.stringify(value));
      return headers;
    }, []);
  const rows = [ ];
  for(let measurementName in measurements) {
    if(measurementName === 'warmup') {
      continue;
    }
    const measurement = measurements[measurementName];
    const row = [ ];
    const original = measurement.items.original;
    const testing = measurement.items.testing;
    row.push(JSON.stringify(measurementName));
    row.push(JSON.stringify(original.count));
    row.push(JSON.stringify(Number(original.totalDuration.toFixed(4))));
    row.push(JSON.stringify(Number(testing.totalDuration.toFixed(4))));
    row.push(JSON.stringify(Number(original.highDuration.toFixed(4))));
    row.push(JSON.stringify(Number(testing.highDuration.toFixed(4))));
    row.push(JSON.stringify(Number(original.lowDuration.toFixed(4))));
    row.push(JSON.stringify(Number(testing.lowDuration.toFixed(4))));
    row.push(JSON.stringify(Number(original.avgDuration.toFixed(4))));
    row.push(JSON.stringify(Number(testing.avgDuration.toFixed(4))));
    const perfDiff = ((testing.avgDuration-original.avgDuration)/original.avgDuration) * -100;
    row.push(JSON.stringify(Number(perfDiff.toFixed(4))));
    rows.push(row);
  }
  return {
    headers,
    rows,
  }
}

