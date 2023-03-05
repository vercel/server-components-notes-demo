import Link from 'next/link'
import { cookies } from 'next/headers'
import { getUser, userCookieKey } from 'libs/session'

export default function AuthButton({
  children,
  noteId
}: {
  children: React.ReactNode
  noteId: string | null
}) {
  const cookieStore = cookies()
  const userCookie = cookieStore.get(userCookieKey)
  const user = getUser(userCookie?.value)
  const isDraft = noteId == null

  if (user) {
    return (
      // Use hard link
      <a href={`/note/edit/${noteId || ''}`} className="link--unstyled">
        <button
          className={[
            'edit-button',
            isDraft ? 'edit-button--solid' : 'edit-button--outline'
          ].join(' ')}
          role="menuitem"
        >
          {children}
          <img
            src={`https://avatars.githubusercontent.com/${user}?s=40`}
            alt="User Avatar"
            title={user}
            className="avatar"
          />
        </button>
      </a>
    )
  }

  return (
    <Link href="/auth" className="link--unstyled">
      <button
        className={[
          'edit-button',
          isDraft ? 'edit-button--solid' : 'edit-button--outline'
        ].join(' ')}
        role="menuitem"
      >
        Login to Add
      </button>
    </Link>
  )
}
