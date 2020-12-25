import redis from '../../libs/redis.server'
import sendRes from '../../libs/send-res.server'

export default async (req, res) => {
  if (req.method === 'GET') {
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]')
    return res.send(JSON.stringify(notes))
  }

  if (req.method === 'POST') {
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]').filter(x => !!x)
    const result = {
      id: Date.now(),
      title: req.body.title,
      updated_at: Date.now(),
      body: req.body.body
    }
    notes.push(result)
    await redis.set('rsc:notes', JSON.stringify(notes))

    return sendRes(req, res, result.id)
  }
}
