/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react'
import { format, isToday } from 'date-fns'
import cheerio from 'cheerio'
import marked from 'marked'
import ClientSidebarNote from './SidebarNote.client'

function excerpts(html, length) {
  const text = cheerio.load(html).text().trim()
    .replace(/(\r\n|\r|\n|\s)+/g, ' ')

  let excerpt = ''
  if (length) {
    excerpt = text.split(' ').slice(0, length).join(' ')
  }
  if (excerpt.length < text.length) excerpt += '...'
  
  return excerpt
}

export default function SidebarNote({ note }) {
  const updatedAt = new Date(note.updated_at)
  const lastUpdatedAt = isToday(updatedAt)
    ? format(updatedAt, 'h:mm bb')
    : format(updatedAt, 'M/d/yy')
  const summary = excerpts(marked(note.body || ''), { words: 20 })
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
