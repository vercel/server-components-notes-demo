const sendRes = require('../libs/send-res.server')

export default async (req, res) => {
  console.time('react.server.js')
  res.on('close', () => console.timeEnd('react.server.js'))
  sendRes(req, res, null)
}
