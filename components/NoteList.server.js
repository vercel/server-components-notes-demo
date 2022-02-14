import React from 'react'
import { useData } from '../libs/use-fetch'
import SidebarNote from './SidebarNote.server'

const apiKey = '/api/notes'

export default function NoteList({ searchText }) {
  const notes = useData(apiKey, key => fetch(key).then(r => r.json()))
  return notes.length > 0 ? (
    <ul className="notes-list">
      {notes.map(note =>
        note &&
        (!searchText ||
          note.title.toLowerCase().includes(searchText.toLowerCase())) ? (
          <li key={note.id}>
            <SidebarNote note={note} />
          </li>
        ) : null
      )}
    </ul>
  ) : (
    <div className="notes-empty">
      {searchText
        ? `Couldn't find any notes titled "${searchText}".`
        : 'No notes created yet!'}{' '}
    </div>
  )
}
