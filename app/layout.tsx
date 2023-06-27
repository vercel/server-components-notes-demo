import './style.css'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { kv } from '@vercel/kv'
import SearchField from 'components/search'
import NoteList from 'components/note-list'
import AuthButton from 'components/auth-button'
import NoteListSkeleton from 'components/note-list-skeleton'

export const metadata = {
  title: 'Next.js 13 + React Server Components Demo',
  description: 'Demo of React Server Components in Next.js. Hosted on Vercel.',
  openGraph: {
    title: 'Next.js 13 + React Server Components Demo',
    description:
      'Demo of React Server Components in Next.js. Hosted on Vercel.',
    images: ['https://next-server-components.vercel.app/og.png']
  },
  robots: {
    index: true,
    follow: true
  },
  metadataBase: new URL('https://next-rsc-notes.vercel.app/')
}

export default async function RootLayout({ children }) {
  // This isn't right yet
  const notes = (await kv.hvals('chat')).sort((a, b) => b.id - a.id)

  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="banner">
            <a
              href="https://nextjs.org/docs/getting-started/react-essentials"
              target="_blank"
            >
              Learn more →
            </a>
          </div>
          <div className="main">
            <Sidebar>
              <Suspense fallback={<NoteListSkeleton />}>
                <NoteList notes={notes} />
              </Suspense>
            </Sidebar>
            <section className="col note-viewer">{children}</section>
          </div>
        </div>
      </body>
    </html>
  )
}

function Sidebar({ children }) {
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
          <AuthButton noteId={null}>Add</AuthButton>
        </section>
        <nav>{children}</nav>
      </section>
    </>
  )
}
