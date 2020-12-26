import redis from '../../libs/redis.server'
import sendRes from '../../libs/send-res.server'

export default async (req, res) => {
  const id = +req.query.id

  if (req.method === 'GET') {
    console.time('get item from redis')
    const note = await redis.hget('rsc:notes_2', id) || 'null'
    console.timeEnd('get item from redis')
    
    return res.send(note)
  }

  if (req.method === 'DELETE') {
    console.time('delete item from redis')
    await redis.hdel('rsc:notes_2', id)
    console.timeEnd('delete item from redis')

    return sendRes(req, res, null)
  }

  if (req.method === 'PUT') {
    console.time('update item from redis')
    const updated = {
      id,
      title: (req.body.title || '').slice(0, 255),
      updated_at: Date.now(),
      body: (req.body.body || '').slice(0, 2048)
    }
    await redis.hset('rsc:notes_2', id, JSON.stringify(updated))
    console.timeEnd('update item from redis')

    return sendRes(req, res, null)
  }
}
