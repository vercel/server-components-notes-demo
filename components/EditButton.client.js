import React, { forwardRef } from 'react'

function EditButton({
  component: Component = 'button',
  noteId,
  disabled,
  title,
  children,
  ...props
}, ref) {
  // const [, setLocation] = useLocation()
  // const [isPending, startTransition] = useTransition()
  const isDraft = noteId == null
  return (
    <Component
      {...props}
      ref={ref}
      className={[
        'edit-button',
        isDraft ? 'edit-button--solid' : 'edit-button--outline',
      ].join(' ')}
      disabled={Boolean(disabled)}
      title={title}
      // onClick={() => {
      //   if (!login) {
      //     // login needed
      //     window.location = '/api/auth'
      //     return
      //   }
      //   if (isDraft) {
      //     // hide the sidebar
      //     const sidebarToggle = document.getElementById('sidebar-toggle')
      //     if (sidebarToggle) {
      //       sidebarToggle.checked = true
      //     }
      //   }
      //   startTransition(() => {
      //     // setLocation(loc => ({
      //     //   selectedId: noteId,
      //     //   isEditing: true,
      //     //   searchText: loc.searchText,
      //     // }))
      //   })
      // }}
      role="menuitem"
    >
      {children}
    </Component>
  )
}

export default forwardRef(EditButton)