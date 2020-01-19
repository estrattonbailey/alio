const path = require("path");
const test = require("ava");
const proxy = require("proxyquire");
const cwd = process.cwd();

test("breaks successfully", t => {
  const resolvePresets = proxy("../lib/resolvePresets.js", {
    "./logger.js": {
      hydrate(data) {
        t.truthy(/foobar/.test(data.error[0]));
        return () => {};
      }
    }
  });

  resolvePresets(["foobar"], { watch: false }, {});
});

test("finds userland module", t => {
  const resolvePresets = require("../lib/resolvePresets.js");

  const config = {};

  resolvePresets(["./tests/mock/preset.js"], { watch: false }, config);

  t.is(config.foo, "mutated");
});

test("accepts direct requires", t => {
  const resolvePresets = require("../lib/resolvePresets.js");

  const config = {};

  resolvePresets([require("./mock/preset.js")()], { watch: false }, config);

  t.is(config.foo, "mutated");
});

test("presets accept options object", t => {
  const resolvePresets = require("../lib/resolvePresets.js");

  const config = {};

  resolvePresets([require("./mock/preset.js")({ foo: 'bar' })], { watch: false }, config);

  t.is(config.foo, "bar");
});

test("will catch error thrown in preset", t => {
  const resolvePresets = proxy("../lib/resolvePresets.js", {
    "./logger.js": {
      hydrate(data) {
        t.truthy(/foo/.test(data.error[0]));
        return () => {};
      }
    }
  });

  resolvePresets(["./tests/mock/invalid-preset.js"], { watch: false }, {});
});
