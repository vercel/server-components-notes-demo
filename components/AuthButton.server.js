import React from 'react'
import EditButton from './EditButton.client'

export default function AuthButton({ children, login, ...props }) {
  // return null
  // DEBUG
  // if (process.env.NODE_ENV === 'development') {
  //   login = false
  // }
  if (!login) {
    return (
      <EditButton {...props}>
        {children}
        <img
          src={`https://avatars.githubusercontent.com/${login}?s=40`}
          alt="User Avatar"
          title={login}
          className="avatar"
        />
      </EditButton>
    )
  }

  return (
    <EditButton login {...props}>
      Login to {children}
    </EditButton>
  )
}
