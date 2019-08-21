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
`alio` also accepts a config. Here's an example:
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
Or an object:
```javascript
module.exports = {
  in: {
    foo: 'src/foo.js'
  }
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

## API
Using `alio` in a node script adds even more flexibility.

## Config
To take advantage of multi-entries and a few other options, you'll need to
define a config file.

```javascript
// spitball.config.js
module.exports = {
  in: 'src/*.js', // string or object syntax
  out: 'dist',
  env: {
    apiKey: 'abcde'
  },
  alias: {
    components: 'src/components/'
  },
  banner: '/** Hello there */', // default undefined
  reload: true // live-reload, defaults to false
}
```

## License
MIT License © [The Couch](https://thecouch.nyc)
