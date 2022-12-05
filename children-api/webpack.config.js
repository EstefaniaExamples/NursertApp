/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const slsw = require('serverless-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  // eslint-disable-next-line no-undef
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'cheap-source-map',
  entry: slsw.lib.entries,
  target: 'node16',
  externals: ['aws-sdk', nodeExternals()],
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.cjs', '.mjs', '.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.webpack'),
            path.resolve(__dirname, '.serverless'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalFileCaching: true,
        },
      },
    ],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
}
