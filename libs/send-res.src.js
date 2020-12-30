const {pipeToNodeWritable} = require('react-server-dom-webpack/writer.node.server')

const React = require('react')
const ReactApp = require('../components/App.server').default

const endpoint = process.env.ENDPOINT
const fetch = require('node-fetch').default

let moduleMap

const componentRegex = /components\/.+\.js/

async function renderReactTree(props, res) {
  // @TODO: do this at build time
  if (!moduleMap) {
    const response = await fetch(endpoint + '/react-client-manifest.json')
    const originalManifest = await response.json()
    const manifest = {}

    // We need to remap the filepaths in the manifest
    // because they have different working directory
    // inside the function.
    for (let key in originalManifest) {
      const componentPath = key.match(componentRegex)[0]
      manifest[componentPath] = originalManifest[key]
    }
    moduleMap = new Proxy(manifest, {
      get: function(target, prop) {
        const componentPath = prop.match(componentRegex)[0]
        return target[componentPath]
      }
    })
  }

  pipeToNodeWritable(React.createElement(ReactApp, props), res, moduleMap)
}

module.exports = async (req, res, redirectToId) => {
  console.time('react render')
  res.on('close', () => console.timeEnd('react render'))

  let location
  try {
    location = JSON.parse(req.query.location)
  } catch (err) {
    return res.send('Missing parameter, skipped.')
  }

  if (redirectToId) {
    location.selectedId = redirectToId
  }
  res.setHeader('X-Location', JSON.stringify(location))

  renderReactTree({
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
    login: req.session.login || null
  }, res)
}
