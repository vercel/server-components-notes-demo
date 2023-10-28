'use client'

import React from 'react'
import { format, isToday } from 'date-fns'
import cheerio from 'cheerio'
import marked from 'marked'
import ClientSidebarNote from './sidebar-note'

export default async function NoteList({ notes, searchText }) {
  if (notes.length === 0) {
    return (
      <div className="notes-empty">
        {searchText
          ? `Couldn't find any notes titled "${searchText}".`
          : 'No notes created yet!'}{' '}
      </div>
    )
  }

  return (
    <ul className="notes-list">
      {notes.map((note) =>
        note &&
        (!searchText ||
          note.title.toLowerCase().includes(searchText.toLowerCase())) ? (
          <li key={note.id}>
            <SidebarNote note={note} />
          </li>
        ) : null
      )}
    </ul>
  )
}

function excerpts(html, length) {
  const text = cheerio
    .load(html)
    .text()
    .trim()
    .replace(/(\r\n|\r|\n|\s)+/g, ' ')

  let excerpt = ''
  if (length) {
    excerpt = text.split(' ').slice(0, length).join(' ')
  }
  if (excerpt.length < text.length) excerpt += '...'

  return excerpt
}

function SidebarNote({ note }) {
  const updatedAt = new Date(note.updated_at)
  const lastUpdatedAt = isToday(updatedAt)
    ? format(updatedAt, 'h:mm bb')
    : format(updatedAt, 'M/d/yy')
  const summary = excerpts(marked(note.body || ''), 20)

  return (
    <ClientSidebarNote
      id={note.id}
      title={note.title}
      expandedChildren={
        <p className="sidebar-note-excerpt">{summary || <i>(No content)</i>}</p>
      }
    >
      <header className="sidebar-note-header">
        <strong>{note.title}</strong>
        <small>{lastUpdatedAt}</small>
      </header>
    </ClientSidebarNote>
  )
}
