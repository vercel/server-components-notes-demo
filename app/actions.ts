'use server'

import { kv } from '@vercel/kv'
import { getUser, userCookieKey } from 'libs/session'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function saveNote(
  noteId: string | null,
  title: string,
  body: string
) {
  const cookieStore = cookies()
  const userCookie = cookieStore.get(userCookieKey)
  const user = getUser(userCookie?.value)

  if (!noteId) {
    noteId = Date.now().toString()
  }

  const payload = {
    id: noteId,
    title: title.slice(0, 255),
    updated_at: Date.now(),
    body: body.slice(0, 2048),
    created_by: user
  }

  await kv.hset('notes', { [noteId]: JSON.stringify(payload) })

  revalidatePath('/')
  redirect(`/note/${noteId}`)
}

export async function deleteNote(noteId: string) {
  revalidatePath('/')
  redirect('/')
}
