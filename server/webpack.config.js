const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './index.ts',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'server.bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  ignoreWarnings: [
    {
      module: /node_modules\/express\/lib\/view\.js/,
      message: /the request of a dependency is an expression/,
    },
    {
      module: /node_modules\/mongodb\/lib\/utils\.js/,
      message: /the request of a dependency is an expression/,
    },
  ],
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^mongodb-client-encryption$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^bson-ext$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^kerberos$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^aws4$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^snappy$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^@mongodb-js\/zstd$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /snappy\/package\.json$/,
    }),
  ],
};
