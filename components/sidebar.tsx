'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SearchField from 'components/search'
import NoteList from 'components/note-list'
import NoteListSkeleton from 'components/note-list-skeleton'

type Note = {
  id: string
  created_by: string
  title: string
  body: string
  updated_at: number
}

export default function Sidebar({
  children,
  notes
}: {
  children: React.ReactNode
  notes: Note[]
}) {
  return (
    <>
      <input type="checkbox" className="sidebar-toggle" id="sidebar-toggle" />
      <section className="col sidebar">
        <Link href={'/'} className="link--unstyled">
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
        </Link>
        <section className="sidebar-menu" role="menubar">
          <SearchField />
          {children}
        </section>
        <nav>
          <Notes notes={notes} />
        </nav>
      </section>
    </>
  )
}

function Notes({ notes }: { notes: Note[] }) {
  const searchParams = useSearchParams()
  const search = searchParams.get('q')

  return (
    <Suspense fallback={<NoteListSkeleton />}>
      <NoteList notes={notes} searchText={search} />
    </Suspense>
  )
}
