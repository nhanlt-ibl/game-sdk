const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  entry: './src/index.ts',
  output: {
    path: __dirname + '/dist',
    filename: 'game-sdk.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        loader: 'ts-loader',
      },
    ],
  },
};
