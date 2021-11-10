import React from 'react'
import { useData } from '../libs/use-fetch'
import SidebarNote from './SidebarNote'


const endpoint = process.env.ENDPOINT
const apiKey = endpoint + '/api/notes'
console.log('apiKey', apiKey)

export default function NoteList({ searchText }) {
  console.log('process', process.env)
  const notes = []
  // useData(
  //   apiKey, 
  //   () => fetch(apiKey).then(r => r.json()).then(json => { console.log(json); return json })
  // )
  console.log('notes', notes)

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
