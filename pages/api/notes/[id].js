import redis from '../../../libs/redis'
import { getUser } from '../../../libs/session'

export default async (req, res) => {
  const id = +req.query.id

  console.time('get item from redis')
  const note = JSON.parse((await redis.hget('rsc:notes_2', id)) || 'null')
  console.timeEnd('get item from redis')

  if (req.method === 'GET') {
    return res.json(note)
  }

  const login = getUser(req)

  if (req.method === 'DELETE') {
    console.time('delete item from redis')
    await redis.hdel('rsc:notes_2', id)
    console.timeEnd('delete item from redis')

    return res.status(204).send(null) // sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
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

    // return sendRes(req, res, null)
    return res.json(updated)
  }

  return res.send('Method not allowed.')
}
