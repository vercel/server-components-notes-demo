import redis from 'libs/redis'
import { getUser, userCookieKey } from 'libs/session'

export default async (req, res) => {
  // we don't need this right now
  // if ((await redis.hlen('rsc:notes_2')) >= 40) {
  //   // let's remove the oldest note
  //   const noteIds = (await redis.hkeys('rsc:notes_2')).sort()
  //   if (noteIds[0]) {
  //     await redis.hdel('rsc:notes_2', noteIds[0])
  //   }
  // }

  const id = Date.now()
  const newNote = {
    id,
    title: (req.body.title || '').slice(0, 255),
    updated_at: Date.now(),
    body: (req.body.body || '').slice(0, 2048),
    created_by: getUser(req.cookies[userCookieKey])
  }

  await redis.hset('rsc:notes_2', id, JSON.stringify(newNote))

  return res.json(newNote)
}
