import React, {Suspense} from 'react'

import SearchField from './SearchField.client'
import EditButton from './EditButton.client'

import Note from './Note.server'
import NoteList from './NoteList.server'

import NoteSkeleton from './NoteSkeleton'
import NoteListSkeleton from './NoteListSkeleton'

export default function App({selectedId, isEditing, searchText}) {
  return <div className="container">
    <div className="banner">
      ⚠️ React Server Components are an experimental and unstable tech preview.&nbsp;
      <a href="https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html?utm_source=vercel" target="_blank">Learn more →</a>
    </div>
    <div className="main">
      <input type="checkbox" class="sidebar-toggle" />
      <section className="col sidebar">
        <section className="sidebar-header">
          <img
            className="logo"
            src="logo.svg"
            width="22px"
            height="20px"
            alt=""
            role="presentation"
          />
          <strong>React Notes</strong>
        </section>
        <section className="sidebar-menu" role="menubar">
          <SearchField />
          <EditButton noteId={null}>New</EditButton>
        </section>
        <nav>
          <Suspense fallback={<NoteListSkeleton />}>
            <NoteList searchText={searchText} />
          </Suspense>
        </nav>
      </section>
      <section className="col note-viewer">
        <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
          <Note selectedId={selectedId} isEditing={isEditing} />
        </Suspense>
      </section>
    </div>
  </div>;
}
