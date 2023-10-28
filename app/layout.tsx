import './style.css'

import React from 'react'
import { kv } from '@vercel/kv'
import Sidebar from 'components/sidebar'
import AuthButton from 'components/auth-button'

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

type Note = {
  id: string
  created_by: string
  title: string
  body: string
  updated_at: number
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const notes = await kv.hgetall('notes')
  let notesArray = notes
    ? Object.values(notes).sort(
        (a, b) => Number((a as Note).id) - Number((b as Note).id)
      )
    : []

  return (
    <html lang="en">
      <body>
        <div className="container">
          <div className="banner">
            <a
              href="https://nextjs.org/docs/app/building-your-application/rendering/server-components"
              target="_blank"
            >
              Learn more →
            </a>
          </div>
          <div className="main">
            <Sidebar notes={notesArray}>
              <AuthButton noteId={null}>Add</AuthButton>
            </Sidebar>
            <section className="col note-viewer">{children}</section>
          </div>
        </div>
      </body>
    </html>
  )
}
