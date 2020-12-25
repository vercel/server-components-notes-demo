import redis from '../../../libs/redis'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)

  if (req.method === 'GET') {
    console.time('get all items from redis')

    const notes = (await redis.hvals('rsc:notes_2'))
      .map(note => JSON.parse(note))
      .sort((a, b) => b.id - a.id)

    console.timeEnd('get all items from redis')
    return res.send(JSON.stringify(notes))
  }

  if (req.method === 'POST') {
    const login = req.session.login

    if (!login) {
      return res.status(403).send('Unauthorized')
    }

    console.time('create item from redis')

    if ((await redis.hlen('rsc:notes_2')) >= 40) {
      // let's remove the oldest note
      const noteIds = (await redis.hkeys('rsc:notes_2')).sort()
      if (noteIds[0]) {
        await redis.hdel('rsc:notes_2', noteIds[0])
      }
    }

    const id = Date.now()
    const newNote = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048),
      created_by: login,
    }

    await redis.hset('rsc:notes_2', id, JSON.stringify(newNote))
    console.timeEnd('create item from redis')

    return sendRes(req, res, id)
  }

  return res.send('Method not allowed.')
}
