const fs = require("fs-extra");
const test = require("ava");
const globby = require("globby");
const alio = require("alio");

const preset = require("./index.js");

test.serial.afterEach(() => {
  globby.sync(["*.compile.js"]).forEach(fs.removeSync);
  fs.removeSync("./temp");
});

test("applies module rule", async t => {
  fs.ensureFileSync("./compiles.compile.js");

  await alio({
    in: "./compiles.compile.js",
    out: "./temp",
    presets: [
      preset(),
      config => {
        t.truthy(
          config.module.rules[0].use.includes(require.resolve("babel-loader"))
        );
      }
    ]
  }).build();
});
