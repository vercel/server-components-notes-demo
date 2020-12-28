const {pipeToNodeWritable} = require('react-server-dom-webpack/writer.node.server')

const React = require('react')
const ReactApp = require('../components/App.server').default

const endpoint = process.env.ENDPOINT
const fetch = require('node-fetch').default

let moduleMap

async function renderReactTree(props, res) {
  if (!moduleMap) {
    const response = await fetch(endpoint + '/react-client-manifest.json')
    const originalManifest = await response.json()
    const manifest = {}

    // Hack: we need to modify the filepath in the manifest
    // and proxy it to unify the map
    // @TODO: this is unsafe, we need to consider file path as well
    for (let key in originalManifest) {
      manifest[key.split('/').pop()] = originalManifest[key]
    }
    moduleMap = new Proxy(manifest, {
      get: function(target, prop) {
        return target[prop.split('/').pop()]
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
