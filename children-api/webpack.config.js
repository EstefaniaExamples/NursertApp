/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const webpack = require('webpack')
const slsw = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals')

module.exports =  (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    context: __dirname,
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'cheap-source-map',
    entry: slsw.lib.entries,
    target: 'node16',
    externals: ['aws-sdk', nodeExternals()],   // we use webpack-node-externals to excludes all node deps.
    performance: {
      hints: false,
    },
    resolve: {
      extensions: ['.cjs', '.mjs', '.js', '.ts'],
      // alias: {
      //   libs: path.resolve(__dirname, 'src/libs')
      // },
      plugins: [new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
      })]
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
              path.resolve(__dirname, 'lib'),
            ],
          ],
          options: {
            transpileOnly: true,
            experimentalFileCaching: true,
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({ AWS_ACCOUNT_ID: `${accountId}` }),
    ],
  }
})();

