import sendRes from '../libs/send-res.server'

export default async (req, res) => {
  await sendRes(req, res, null)
}
