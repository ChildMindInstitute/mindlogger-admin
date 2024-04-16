/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const MAX_CYCLES = 5;
let numCyclesDetected = 0;

module.exports = function override(config) {
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'),
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
    process: false,
    fs: false,
    path: false,
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  );

  if (process.argv.includes('checkCycles')) {
    config.plugins.push(
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        onStart({ compilation }) {
          numCyclesDetected = 0;
        },
        onDetected({ module: webpackModuleRecord, paths, compilation }) {
          numCyclesDetected++;
          compilation.warnings.push(new Error(paths.join(' -> ')));
        },
        onEnd({ compilation }) {
          if (numCyclesDetected > MAX_CYCLES) {
            compilation.errors.push(
              new Error(
                `Detected ${numCyclesDetected} cycles which exceeds configured limit of ${MAX_CYCLES}`,
              ),
            );
          }
        },
    }));
  }

  return config;
};
