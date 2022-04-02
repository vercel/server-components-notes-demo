import { unstable_useRefreshRoot as useRefreshRoot } from 'next/streaming'
import React, { useTransition } from 'react'
import Spinner from './Spinner'

export default function SearchField() {
  const refresh = useRefreshRoot()
  const [isSearching, startSearching] = useTransition({ timeoutMs: 200 })

  return (
    <form className="search" role="search" onSubmit={e => e.preventDefault()}>
      <label className="offscreen" htmlFor="sidebar-search-input">
        Search for a note by title
      </label>
      <input
        id="sidebar-search-input"
        placeholder="Search"
        onChange={e => {
          startSearching(() => {
            refresh({ searchText: e.target.value })
          })
        }}
      />
      <Spinner active={isSearching} />
    </form>
  )
}
