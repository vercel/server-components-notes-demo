module.exports = async function (source) {
  const callback = this.async()
  this.cacheable()

  const dependencies = []
  source.split('\n').forEach(line => {
    if (/^import /.test(line)) {
      dependencies.push(line)
    }
  })

  const transformedSource = 
    dependencies.join('\n') +
    `
module.exports = {
  '__esModule': true,
  '$$typeof': Symbol.for('react.module.reference'),
  filepath: 'file://${this.resourcePath}',
  name: '*',
  defaultProps: undefined,
  default: {
    '$$typeof': Symbol.for('react.module.reference'),
    filepath: 'file://${this.resourcePath}',
    name: ''
  }
}
    `

  return callback(null, transformedSource)
}
