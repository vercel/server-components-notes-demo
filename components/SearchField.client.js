import { unstable_useRefreshRoot as useRefreshRoot } from 'next/streaming'
import React, { useState, useTransition } from 'react'
import Spinner from './Spinner'

export default function SearchField() {
  const refresh = useRefreshRoot()
  const [text, setText] = useState('')
  const [isSearching, startSearching] = useTransition({ timeoutMs: 200 })

  return (
    <form className="search" role="search" onSubmit={e => e.preventDefault()}>
      <label className="offscreen" htmlFor="sidebar-search-input">
        Search for a note by title
      </label>
      <input
        id="sidebar-search-input"
        placeholder="Search"
        value={text}
        onChange={e => {
          const newText = e.target.value
          setText(newText)
          refresh({ searchText: newText })
          startSearching(() => {})
        }}
      />
      <Spinner active={isSearching} />
    </form>
  )
}
