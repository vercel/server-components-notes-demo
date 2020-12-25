const ReactServerWebpackPlugin = require('react-server-dom-webpack/plugin')
const fs = require('fs')

class CopyReactClientManifest {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'CopyReactClientManifest',
      (compilation, callback) => {
        const content = (compilation.assets['react-client-manifest.json']).source()
        fs.writeFile('./public/react-client-manifest.json', content, callback)
      }
    );
  }
}

module.exports = {
  experimental: {
     reactMode: 'concurrent'
  },
  api: {
    bodyParser: false,
  },
  webpack: (config) => {
    config.plugins.push(new ReactServerWebpackPlugin({isServer: false}))
    config.plugins.push(new CopyReactClientManifest())
    return config
  },
}