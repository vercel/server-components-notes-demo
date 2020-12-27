import redis from '../../libs/redis.server'
import sendRes from '../../libs/send-res.server'

export default async (req, res) => {
  if (req.method === 'GET') {
    console.time('get all items from redis')

    const notes = (await redis.hvals('rsc:notes_2'))
      .map(note => JSON.parse(note))
      .sort((a, b) => b.id - a.id)

    console.timeEnd('get all items from redis')
    return res.send(JSON.stringify(notes))
  }

  if (req.method === 'POST') {
    console.time('create item from redis')

    if (await redis.hlen('rsc:notes_2') >= 20) {
      console.timeEnd('create item from redis')
      return sendRes(req, res, result.id)
    }
  
    const id = Date.now();
    const newNote = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048)
    }

    await redis.hset('rsc:notes_2', id, JSON.stringify(newNote))
    console.timeEnd('create item from redis')

    return sendRes(req, res, id)
  }

  return res.send('Method not allowed.')
}
