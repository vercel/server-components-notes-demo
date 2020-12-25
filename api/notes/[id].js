import redis from '../../libs/redis.server'
import sendRes from '../../libs/send-res.server'

export default async (req, res) => {
  const id = +req.query.id

  if (req.method === 'GET') {
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]')
    return res.send(notes.find(note => note.id === id) || null)
  }

  if (req.method === 'DELETE') {
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]')
    const index = notes.findIndex(note => note.id === id)
    if (index >= 0) {
      const updated = notes.splice(index, 1)
      await redis.set('rsc:notes', JSON.stringify(updated))
    }
    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]')
    const updated = notes.map(note => {
      if (note.id !== id) return note
      return {
        id,
        title: req.body.title,
        updated_at: Date.now(),
        body: req.body.body
      }
    })
    await redis.set('rsc:notes', JSON.stringify(updated))
    return sendRes(req, res, null)
  }
}
