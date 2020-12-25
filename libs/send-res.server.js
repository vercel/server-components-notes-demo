const util = require('util')
const exec = util.promisify(require('child_process').exec)

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

  // we have to use a node process to render it
  // since it's very tricky within the webpack environment
  // @TODO: how can we make streaming work?
  const { stdout, stderr } = await exec(`node libs/render-react-tree.server.js '${arg}'`)
  if (stderr) {
    throw new Error(stderr)
  }

  res.end(stdout)
}
