import redis from 'libs/redis'
import { cookies } from 'next/headers'
import { getUser, userCookieKey } from 'libs/session'
import NoteUI from 'components/note-ui'

export const metadata = {
  robots: {
    index: false
  }
}

export default async function EditPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const userCookie = cookieStore.get(userCookieKey)
  const user = getUser(userCookie?.value)

  const note = JSON.parse((await redis.hget('rsc:notes_2', params.id)) || null)
  const isCreator = note?.created_by === user || true

  if (note === null) {
    return (
      <div className="note--empty-state">
        <span className="note-text--empty-state">
          Click a note on the left to view something! 🥺
        </span>
      </div>
    )
  }

  return <NoteUI note={note} isEditing={isCreator} />
}
