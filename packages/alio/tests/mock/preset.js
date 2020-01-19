module.exports = (options = {}) => (config, ctx) => {
  config.foo = options.foo || 'mutated';
}
