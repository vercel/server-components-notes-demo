import Link from 'next/link'
import React from 'react'
import EditButton from './EditButton.client'

export default function AuthButton({ children, login, noteId, ...props }) {
  if (login) {
    return (
      // Use hard link
      <a href={`/note/edit/${noteId || ''}`} className="link--unstyled">
        <EditButton {...props} login={login}>
          {children}
          <img
            src={`https://avatars.githubusercontent.com/${login}?s=40`}
            alt="User Avatar"
            title={login}
            className="avatar"
          />
        </EditButton>
      </a>
    )
  }

  return (
    <Link href={`/auth`}>
      <a className="link--unstyled">
        <EditButton {...props}>Login to {children}</EditButton>
      </a>
    </Link>
  )
}
