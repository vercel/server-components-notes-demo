import redis from '../../libs/redis.server'
import sendRes from '../../libs/send-res.server'

export default async (req, res) => {
  const id = +req.query.id

  if (req.method === 'GET') {
    console.time('get item from redis')
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]')
    console.timeEnd('get item from redis')
    return res.send(notes.find(note => note.id === id) || null)
  }

  if (req.method === 'DELETE') {
    console.time('delete item from redis')
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]')
    const index = notes.findIndex(note => note.id === id)
    if (index >= 0) {
      notes.splice(index, 1)
      await redis.set('rsc:notes', JSON.stringify(notes))
    }
    console.timeEnd('delete item from redis')
    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    console.time('update item from redis')
    const notes = JSON.parse(await redis.get('rsc:notes') || '[]')
    const updated = notes.map(note => {
      if (note.id !== id) return note
      return {
        id,
        title: (req.body.title || '').slice(0, 255),
        updated_at: Date.now(),
        body: (req.body.body || '').slice(0, 2048)
      }
    })
    await redis.set('rsc:notes', JSON.stringify(updated))
    console.timeEnd('update item from redis')
    return sendRes(req, res, null)
  }
}
