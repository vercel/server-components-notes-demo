import React, { forwardRef } from 'react'

function EditButton({
  component: Component = 'button',
  noteId,
  children,
  ...props
}, ref) {
  const isDraft = noteId == null
  return (
    <Component
      {...props}
      ref={ref}
      className={[
        'edit-button',
        isDraft ? 'edit-button--solid' : 'edit-button--outline',
      ].join(' ')}
      role="menuitem"
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
      // }}
    >
      {children}
    </Component>
  )
}

export default forwardRef(EditButton)