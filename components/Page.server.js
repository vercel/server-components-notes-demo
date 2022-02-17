import React, { Suspense } from 'react'
import Link from 'next/link'
import SearchField from './SearchField.client'
import NoteList from './NoteList.server'
import AuthButton from './AuthButton.server'
import NoteListSkeleton from './NoteListSkeleton'

export default function Page({ children, searchText = '', login }) {
  return (
    <div className="container">
      <div className="banner">
        <a href="https://nextjs.org/docs/advanced-features/react-18" target="_blank">
          Learn more about using React Server Components in Next.js →
        </a>
      </div>
      <div className="main">
        <input type="checkbox" className="sidebar-toggle" id="sidebar-toggle" />
        <section className="col sidebar">
          <Link href={'/'}>
            <a className="link--unstyled">
              <section className="sidebar-header">
                <img
                  className="logo"
                  src="/logo.svg"
                  width="22px"
                  height="20px"
                  alt=""
                  role="presentation"
                />
                <strong>React Notes</strong>
              </section>
            </a>
          </Link>
          <section className="sidebar-menu" role="menubar">
            <SearchField />
            <AuthButton login={login} noteId={null}>
              Add
            </AuthButton>
          </section>
          <nav>
            <Suspense fallback={<NoteListSkeleton />}>
              <NoteList searchText={searchText} />
            </Suspense>
          </nav>
        </section>
        <section className="col note-viewer">{children}</section>
      </div>
    </div>
  )
}
