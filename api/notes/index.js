import redis from '../../libs/redis.server'
import sendRes from '../../libs/send-res.server'

export default async (req, res) => {
  if (req.method === 'GET') {
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]')
    return res.send(JSON.stringify(notes))
  }

  if (req.method === 'POST') {
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]').filter(x => !!x)
    if (notes.length >= 100) {
      return sendRes(req, res, null)
    }

    const result = {
      id: Date.now(),
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048)
    }
    notes.push(result)
    await redis.set('rsc:notes', JSON.stringify(notes))

    return sendRes(req, res, result.id)
  }
}
