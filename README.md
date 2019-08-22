# alio
A little compiler utility.

```bash
npm i -D alio
```

### Features
1. glob & multi-entries
2. modern JS
3. modern CSS
4. live-reload
5. convenient CLI

# Usage
`alio` can be used programmatically, or via its built-in CLI.

## CLI
Alio supports two commands:
```bash
alio build
alio watch
```
Entries should be specified next:
```bash
alio watch src/foo.js
```
And you can have more than one:
```bash
alio watch src/foo.js src/bar.js
```
Or use a glob:
```bash
alio watch src/*.js
```
Output is specified with a flag *after* your entries:
```bash
alio watch src/*.js --out dist/
```

### CLI Usage
If installed locally to a project, define an npm script:
```json
{
  "scripts": {
    "build": "alio build src/*.js --out /dist"
  }
}
```
Or use your local copy directly:
```bash
./node_modules/.bin/alio build src/*.js --out /dist
```
If you'd like to use as a globally installed binary, use `npx`:
```bash
npx alio build src/*.js --out /dist
```

### Configuration
`alio` also accepts a config in place of CLI flags. Here's an example:
```javascript
module.exports = {
  in: 'src/*.js',
  out: '/dist',
  env: {
    API_KEY: process.env.API_KEY
  },
  alias: {
    '@': process.cwd()
  },
  banner: '/** Added to top of file */',
  reload: false
}
```

By default, it looks for `alio.config.js` in the current working directory. To
specify a different config, use the `--config` flag:
```bash
alio --config ./alio.production.js
```

#### `config.in`
The entrypoint in `alio` is mapped directly to Webpack.

It supports a single file:
```javascript
module.exports = {
  in: 'src/foo.js'
}
```
A glob:
```javascript
module.exports = {
  in: 'src/*.js'
}
```
An object:
```javascript
module.exports = {
  in: {
    foo: 'src/foo.js'
  }
}
```
An array:
```javascript
module.exports = {
  in: [
    'src/foo.js',
    'src/bar.js'
  ]
}
```
Or a combo, as an array:
```javascript
module.exports = {
  in: [
    'src/*.js',
    'public/util.js'
  ]
}
```

#### `config.out`
The `out` prop is also mapped directly to Webpack.

By default, you can just specify a directory:
```javascript
module.exports = {
  out: '/dist'
}
```
But for more control, you can supply a
[Webpack-compatible](https://webpack.js.org/concepts/output/) `output` object:
```javascript
module.exports = {
  out: {
    filename: '[name].[hash].js'
  }
}
```

#### `config.env`
Accepts an object with keys and values, which are passed to Webpack's [Define
Plugin](https://webpack.js.org/plugins/define-plugin/).

#### `config.alias`
Creates handy aliases for imports. See [Webpack
docs](https://webpack.js.org/configuration/resolve/#resolvealias).

#### `config.banner`
Adds a string to the top of all compiled files.

#### `config.reload`
In watch mode only, inserts a tiny live-reload script that will refresh you
browser every time a file change is made.

### Multi-config
`alio` supports multiple configs using the config file as well:
```javascript
module.exports = [
  {
    in: 'src/foo.js'
  },
  {
    in: 'src/bar.js'
  }
]
```

## API
Your can also use `alio` in a node script.

First, pass a config object, or array of configs, to the `alio` factory:
```javascript
const alio = require('alio')

const bundle = alio([
  { in: 'src/foo.js' }
])
```

Then, call either `build` or `watch`:
```javascript
bundle.build()
```

## License
MIT License © [Eric Bailey](https://estrattonbailey.com)
