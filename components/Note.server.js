import React from 'react'
import { useData } from '../libs/use-fetch'
import NoteUI from './NoteUI.server'

export default function Note({ selectedId, isEditing, login }) {
  const apiKey = `/api/notes/${selectedId}`
  const note =
    selectedId
      ? useData(apiKey, key => fetch(key).then(r => r.json()), {
          revalidate: 1,
        })
      : null

  if (note === null) {
    return (
      <div className="note--empty-state">
        <span className="note-text--empty-state">
          Click a note on the left to view something! 🥺
        </span>
      </div>
    )
  }

  return <NoteUI note={note} isEditing={isEditing} login={login} />
}
