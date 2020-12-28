/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import {fetch} from 'react-fetch';
import {format} from 'date-fns';

import NotePreview from './NotePreview'
import NoteEditor from './NoteEditor.client'
import EditButton from './EditButton.client'

import AuthButton from './AuthButton.server'

const endpoint = process.env.ENDPOINT

export default function Note({selectedId, isEditing, login}) {
  const note =
    selectedId != null
      ? fetch(`${endpoint}/api?id=${selectedId}`).json()
      : null;

  if (note === null) {
    if (isEditing) {
      return (
        <NoteEditor noteId={null} initialTitle="Untitled" initialBody="" />
      );
    } else {
      return (
        <div className="note--empty-state">
          <span className="note-text--empty-state">
            Click a note on the left to view something! 🥺
          </span>
        </div>
      );
    }
  }

  let {id, title, body, updated_at, created_by: created_by} = note;
  const updatedAt = new Date(updated_at);

  if (isEditing) {
    return <NoteEditor noteId={id} initialTitle={title} initialBody={body} />;
  } else {
    return (
      <div className="note">
        <div className="note-header">
          <h1 className="note-title">{title}</h1>
          {created_by ? 
            <div style={{
              flex: '1 0 100%',
              order: '-1',
              marginTop: 10
            }}>By <img src={`https://avatars.githubusercontent.com/${created_by}?s=40`} alt="User Avatar" title={created_by} className="avatar" /></div> :
            null
          }
          <div className="note-menu" role="menubar">
            <small className="note-updated-at" role="status">
              Last updated on {format(updatedAt, "d MMM yyyy 'at' h:mm bb")}
            </small>
            {
              login === created_by
                ? <AuthButton login={login} noteId={id}>Edit</AuthButton>
                : <EditButton disabled noteId={id} title="You can only edit your notes">Unauthorized</EditButton>
            }
          </div>
        </div>
        <NotePreview body={body} />
      </div>
    );
  }
}
