const sendRes = require('../libs/send-res.server')

export default async (req, res) => {
  console.time('react.server.js')
  await sendRes(req, res, null)
  console.timeEnd('react.server.js')
}
