import redis from 'libs/redis'
import { getUser, userCookieKey } from 'libs/session'

export default async (req, res) => {
  const id = +req.query.id
  const login = getUser(req.cookies[userCookieKey])

  if (req.method === 'DELETE') {
    await redis.hdel('rsc:notes_2', id)
    return res.status(204).send(null)
  }

  if (req.method === 'PUT') {
    const updated = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048),
      created_by: login
    }
    await redis.hset('rsc:notes_2', id, JSON.stringify(updated))
    return res.json(updated)
  }

  return res.send('Method not allowed.')
}
