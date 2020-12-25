import redis from '../../../libs/redis'
import sendRes from '../../../libs/send-res-with-module-map'
import session from '../../../libs/session'

export default async (req, res) => {
  session(req, res)
  const id = +req.query.id
  const login = req.session.login

  console.time('get item from redis')
  const note = JSON.parse((await redis.hget('rsc:notes_2', id)) || 'null')
  console.timeEnd('get item from redis')

  if (req.method === 'GET') {
    return res.send(JSON.stringify(note))
  }

  if (req.method === 'DELETE') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    console.time('delete item from redis')
    await redis.hdel('rsc:notes_2', id)
    console.timeEnd('delete item from redis')

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    if (!login || login !== note.created_by) {
      return res.status(403).send('Unauthorized')
    }

    console.time('update item from redis')
    const updated = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048),
      created_by: login,
    }
    await redis.hset('rsc:notes_2', id, JSON.stringify(updated))
    console.timeEnd('update item from redis')

    return sendRes(req, res, null)
  }

  return res.send('Method not allowed.')
}
