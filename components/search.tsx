'use client'

import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import { searchNotes } from '../app/actions'

export default function SearchField() {
  const { pending } = useFormStatus()

  return (
    <form className="search" role="search" action={searchNotes}>
      <label className="offscreen" htmlFor="sidebar-search-input">
        Search for a note by title
      </label>
      <input id="sidebar-search-input" placeholder="Search" name="search" />
      <Spinner active={pending} />
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
