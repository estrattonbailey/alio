const path = require('path');
const cwd = process.cwd();
const log = require("./logger.js");

const locations = [
  key => key,
  key => path.resolve(cwd, key),
];

function resolve(key) {
  for (const loc of locations) {
    try {
      return require(loc(key));
    } catch (e) {}
  }
}

module.exports = function resolvePresets(presets, args, wc) {
  for (const p of presets) {
    if (typeof p === 'function') {
      p(wc, args);
    } else {
      try {
        let preset = resolve(`@alio/preset-${p}`);

        if (!preset) {
          preset = resolve(p);
        }

        if (!preset) {
          throw new Error(`cannot find ${p} preset, please make sure it's installed`);
        }

        preset()(wc, args);
      } catch (e) {
        log.hydrate({
          error: [ e.message ]
        })();
      }
    }
  }
};
