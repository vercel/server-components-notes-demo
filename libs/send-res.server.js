const {pipeToNodeWritable} = require('react-server-dom-webpack/writer.node.server')
const stream = require('stream')
const {readFileSync} = require('fs')
const path = require('path')

// https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific
// const nodeRequire = __non_webpack_require__

const babelRegister = require('@babel/register')
babelRegister({
  presets: ['@babel/preset-react'],
  plugins: ['@babel/plugin-transform-modules-commonjs'],
})

const React = require('react')
require('react-server-dom-webpack/node-register')()
const ReactApp = require(path.resolve('components/App.server')).default

async function generate(arg) {
  // async function waitForWebpack() {
  //   while (true) {
  //     try {
  //       readFileSync(path.resolve('.next/react-client-manifest.json'))
  //       return;
  //     } catch (err) {
  //       // console.log(
  //       //   'Could not find webpack build output. Will retry in a second...'
  //       // );
  //       await new Promise((resolve) => setTimeout(resolve, 1000))
  //     }
  //   }
  // }

  function renderReactTree(props, cb) {
    // await waitForWebpack()
    const manifest = readFileSync(
      path.resolve('.next/react-client-manifest.json'),
      'utf8'
    )
    const moduleMap = JSON.parse(manifest)
    
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
  const output = await generate({
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
  })

  res.end(output)
}
