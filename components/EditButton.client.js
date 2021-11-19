import React, { useTransition } from 'react'

// import { useLocation } from './LocationContext.client'

export default function EditButton({
  login,
  noteId,
  disabled,
  title,
  children,
}) {
  console.log('login', login)
  // const [, setLocation] = useLocation()
  const [isPending, startTransition] = useTransition()
  const isDraft = noteId == null
  return (
    <button
      className={[
        'edit-button',
        isDraft ? 'edit-button--solid' : 'edit-button--outline',
      ].join(' ')}
      disabled={Boolean(isPending || disabled)}
      title={title}
      onClick={() => {
        if (login) {
          // login needed
          window.location = '/api/auth'
          return
        }
        if (isDraft) {
          // hide the sidebar
          const sidebarToggle = document.getElementById('sidebar-toggle')
          if (sidebarToggle) {
            sidebarToggle.checked = true
          }
        }
        startTransition(() => {
          // setLocation(loc => ({
          //   selectedId: noteId,
          //   isEditing: true,
          //   searchText: loc.searchText,
          // }))
        })
      }}
      role="menuitem"
    >
      {children}
    </button>
  )
}
