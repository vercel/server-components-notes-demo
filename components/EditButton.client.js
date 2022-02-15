import React, { forwardRef } from 'react'

function EditButton(
  { component: Component = 'button', noteId, children, ...props },
  ref
) {
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
    >
      {children}
    </Component>
  )
}

export default forwardRef(EditButton)
