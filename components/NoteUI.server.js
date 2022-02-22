import { format } from 'date-fns'
import NotePreview from './NotePreview'
import NoteEditor from './NoteEditor.client'
import AuthButton from './AuthButton.server'

export default function NoteUI({ note, isEditing, login }) {
  const { id, title, body, updated_at, created_by: createdBy } = note
  const updatedAt = new Date(updated_at || 0)

  if (isEditing) {
    return <NoteEditor noteId={id} initialTitle={title} initialBody={body} />
  }
  return (
    <div className="note">
      <div className="note-header">
        <h1 className="note-title">{title}</h1>
        {createdBy ? (
          <div
            style={{
              flex: '1 0 100%',
              order: '-1',
              marginTop: 10,
            }}
          >
            By{' '}
            <img
              src={`https://avatars.githubusercontent.com/${createdBy}?s=40`}
              alt="User Avatar"
              title={createdBy}
              className="avatar"
            />
            &nbsp;
            <a
              href={`https://github.com/${createdBy}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {createdBy}
            </a>
          </div>
        ) : null}
        <div className="note-menu" role="menubar">
          <small className="note-updated-at" role="status">
            Last updated on {format(updatedAt, "d MMM yyyy 'at' h:mm bb")}
          </small>
          {login === createdBy ? (
            <AuthButton login={login} noteId={id}>
              Edit
            </AuthButton>
          ) : (
            <div style={{ height: 30 }} />
          )}
        </div>
      </div>
      <NotePreview body={body} />
    </div>
  )
}
