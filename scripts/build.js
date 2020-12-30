const webpack = require('webpack')
const path = require('path')

webpack({
  mode: 'production',
  entry: './libs/send-res.src',
  output: {
    path: path.resolve('./libs'),
    filename: 'send-res.server.js',
    libraryTarget: 'commonjs2'
  },
  optimization: {
    // minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: ['@babel/transform-modules-commonjs']
          }
        }
      },
      {
        test: /\.client\.js/,
        use: {
          loader: path.resolve('./scripts/client-react-loader.js')
        }
      }
    ],
  },
  stats: 'errors-only',
  target: 'node'
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.log('errored while compiling')
  }
})
