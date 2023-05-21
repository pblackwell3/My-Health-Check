const path = require('path');

module.exports = {
  // The entry point file described above
  entry: './public/src/app.js',
  // The location of the build folder described above
  output: {
    publicPath: 'dist/',
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js'
  },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',
};