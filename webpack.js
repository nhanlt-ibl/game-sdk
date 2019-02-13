const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  entry: './lib/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'quantasdk.js'
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  mode: 'production',
  module: {
    rules: [
    ]
  }
}
