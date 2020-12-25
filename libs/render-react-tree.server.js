require('react-server-dom-webpack/node-register')()
const babelRegister = require('@babel/register')
babelRegister({
  presets: ['@babel/preset-react'],
  plugins: ['@babel/plugin-transform-modules-commonjs'],
})

const {readFileSync} = require('fs')
const path = require('path')
const {pipeToNodeWritable} = require('react-server-dom-webpack/writer.node.server')

const React = require('react')
const ReactApp = require('../components/App.server').default
const stream = require('stream')

const isProduction = process.env.NODE_ENV === 'production'

async function waitForWebpack() {
  while (true) {
    try {
      readFileSync(path.resolve('.next/react-client-manifest.json'))
      return;
    } catch (err) {
      // console.log(
      //   'Could not find webpack build output. Will retry in a second...'
      // );
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

async function renderReactTree(props) {
  await waitForWebpack()
  const manifest = readFileSync(
    path.resolve('.next/react-client-manifest.json'),
    'utf8'
  )
  const moduleMap = JSON.parse(manifest)
  pipeToNodeWritable(React.createElement(ReactApp, props), process.stdout, moduleMap)
}

renderReactTree(JSON.parse(process.argv[2]))
