'use client'

import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'

export default function SearchField() {
  const router = useRouter()
  // @ts-ignore
  const [isSearching, startSearching] = useTransition({ timeoutMs: 200 })

  return (
    <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
      <label className="offscreen" htmlFor="sidebar-search-input">
        Search for a note by title
      </label>
      <input
        id="sidebar-search-input"
        placeholder="Search"
        onChange={(e) => {
          startSearching(() => {
            // e.target.value
            router.refresh()
          })
        }}
      />
      <Spinner active={isSearching} />
    </form>
  )
}

function Spinner({ active = true }) {
  return (
    <div
      className={['spinner', active && 'spinner--active'].join(' ')}
      role="progressbar"
      aria-busy={active ? 'true' : 'false'}
    />
  )
}
