const sendRes = require('../libs/send-res.server')

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.send('Method not allowed.')
  }
  
  sendRes(req, res, null)
}
