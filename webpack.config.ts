import * as path from 'path';
import { Configuration as WebpackConfiguration, HotModuleReplacementPlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import TerserPlugin from 'terser-webpack-plugin';
import CopyWebpackPlugin from './webpack/copy-webpack-plugin';
import Base64AssetLoaderPlugin from './webpack/base64-asset-loader-plugin';
import RemoveAssetsPlugin from './webpack/remove-assets-plugin';
import { Arguments, EnvironmentOptions } from './webpack/interfaces';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config = (_: EnvironmentOptions, argv: Arguments): Configuration => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: {
      cgol: './src/index.ts',
      worker: './src/worker.ts'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 9000,
      historyApiFallback: true,
      hot: true
    },
    devtool: isDevelopment ? 'inline-source-map' : false,
    optimization: {
      minimize: !isDevelopment,
      minimizer: [new TerserPlugin({
        terserOptions: {
          mangle: !isDevelopment,
          sourceMap: isDevelopment
        },
        parallel: true
      })]
    },
    plugins: [
      new HotModuleReplacementPlugin(),
      new CopyWebpackPlugin({
        patterns: [{
          from: path.resolve(__dirname, 'example.html'),
          to: path.resolve(__dirname, 'dist/index.html'),
          override: true
        }]
      }),
      new Base64AssetLoaderPlugin({
        patterns: [{
          targetAsset: 'cgol.js',
          sourceAsset: 'worker.js',
          macro: '<% WORKER DATA URL %>'
        }]
      }),
      new RemoveAssetsPlugin({
        assetPaths: [
          path.resolve(__dirname, 'dist/worker.js')
        ]
      })
    ]
  };
};

export default config;
