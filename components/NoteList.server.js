/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import {fetch} from 'react-fetch';

import SidebarNote from './SidebarNote'

export default function NoteList({searchText}) {
  const notes = fetch('http://localhost:3000/api/notes').json()

  return notes.length > 0 ? (
    <ul className="notes-list">
      {notes.map((note) => (
        note && (!searchText || note.title.includes(searchText)) ? <li key={note.id}>
          <SidebarNote note={note} />
        </li> : null
      ))}
    </ul>
  ) : (
    <div className="notes-empty">
      {searchText
        ? `Couldn't find any notes titled "${searchText}".`
        : 'No notes created yet!'}{' '}
    </div>
  );
}
