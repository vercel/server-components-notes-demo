const ReactServerWebpackPlugin = require('react-server-dom-webpack/plugin')

module.exports = {
  experimental: {
     reactMode: 'concurrent'
  },
  api: {
    bodyParser: false,
  },
  webpack: (config) => {
    config.plugins.push(new ReactServerWebpackPlugin({isServer: false}))
    return config
  },
}