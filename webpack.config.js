// This file is just for the tests, it doesn't compile anything
module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    modules: ['node_modules', 'src/tests/fixtures']
  },
}
