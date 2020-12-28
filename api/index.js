import redis from '../libs/redis.server'
import sendRes from '../libs/send-res.server'
import session from '../libs/session'

export default async (req, res) => {
  session(req, res)
  const id = +req.query.id
  const login = req.session.login

  // if `id` is `0`, it points to the /notes endpoint
  if (id === 0) {
    if (req.method === 'GET') {
      console.time('get all items from redis')
  
      const notes = (await redis.hvals('rsc:notes_2'))
        .map(note => JSON.parse(note))
        .sort((a, b) => b.id - a.id)
  
      console.timeEnd('get all items from redis')
      return res.send(JSON.stringify(notes))
    }
  
    if (req.method === 'POST') {
      if (!login) {
        return res.status(403).send('Unauthorized')
      }

      console.time('create item from redis')

      if (await redis.hlen('rsc:notes_2') >= 40) {
        // let's remove the oldest note
        const noteIds = (await redis.hkeys('rsc:notes_2')).sort()
        if (noteIds[0]) {
          await redis.hdel('rsc:notes_2', noteIds[0])
        }
      }

      const id = Date.now();
      const newNote = {
        id,
        title: (req.body.title || '').slice(0, 255),
        updated_at: Date.now(),
        body: (req.body.body || '').slice(0, 2048),
        created_by: login
      }
  
      await redis.hset('rsc:notes_2', id, JSON.stringify(newNote))
      console.timeEnd('create item from redis')
  
      return sendRes(req, res, id)
    }
  } else if (!isNaN(id)) {
    // if `id` is a number, it points to the /notes/[id] endpoint

    console.time('get item from redis')
    const note = await redis.hget('rsc:notes_2', id) || 'null'
    console.timeEnd('get item from redis')
    
    if (req.method === 'GET') {
      return res.send(note)
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
        created_by: login
      }
      await redis.hset('rsc:notes_2', id, JSON.stringify(updated))
      console.timeEnd('update item from redis')

      return sendRes(req, res, null)
    }
  }

  // if `id` is undefined, it points to /react endpoint
  if (req.method !== 'GET') {
    return res.send('Method not allowed.')
  }
  
  sendRes(req, res, null)
}
