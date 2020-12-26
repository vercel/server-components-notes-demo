const {pipeToNodeWritable} = require('react-server-dom-webpack/writer.node.server')
const stream = require('stream')
const {readFileSync} = require('fs')
const path = require('path')

// https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific
// const nodeRequire = __non_webpack_require__

const babelRegister = require('@babel/register')

require('@babel/plugin-transform-modules-commonjs')
require('@babel/preset-react')

babelRegister({
  presets: ['@babel/preset-react'],
  plugins: ['@babel/transform-modules-commonjs'],
})

// lambda deps
require('react-fetch')
require('date-fns')
require('excerpts')
require('marked')
require('sanitize-html')

const React = require('react')
require('react-server-dom-webpack/node-register')()
const ReactApp = require('../components/App.server').default

const endpoint = process.env.ENDPOINT
const fetch = require('node-fetch')

let moduleMap

async function generate(arg) {
  async function renderReactTree(props, cb) {
    if (!moduleMap) {
      const response = await fetch(endpoint + '/react-client-manifest.json')
      const originalManifest = await response.json()
      const manifest = {}

      // hack: we need to modify the filepath in the manifest
      // and proxy it to unify the map
      for (let key in originalManifest) {
        manifest[key.split('/').pop()] = originalManifest[key]
      }
      moduleMap = new Proxy(manifest, {
        get: function(target, prop) {
          return target[prop.split('/').pop()]
        }
      })
    }
    
    let data = ''
    const dest = new stream.Writable({
      write: (chunk, _, callback) => {
        data += chunk
        callback()
      },
      final: () => {
        cb(data)
      }
    })

    pipeToNodeWritable(React.createElement(ReactApp, props), dest, moduleMap)
  }

  // await renderReactTree(JSON.parse(process.argv[2]))
  return await new Promise(res => renderReactTree(arg, res))
}

export default async (req, res, redirectToId) => {
  const location = JSON.parse(req.query.location)
  if (redirectToId) {
    location.selectedId = redirectToId
  }
  res.setHeader('X-Location', JSON.stringify(location))

  const arg = JSON.stringify({
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
  })

  // we have to use another nodejs process to render it
  // since it's very tricky within the webpack environment
  // @TODO: how can we make streaming work?
  // const { stdout, stderr } = await exec(`node ./_render.server.js '${arg}'`)
  // if (stderr) {
  //   throw new Error(stderr)
  // }
  
  console.time('react render')
  const output = await generate({
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
  })
  console.timeEnd('react render')

  res.end(output)
}
