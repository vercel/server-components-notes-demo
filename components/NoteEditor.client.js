import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NotePreview from './NotePreview'

export default function NoteEditor({ noteId, initialTitle, initialBody }) {
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)

  const router = useRouter()
  const [isSaving, saveNote] = useMutation({
    endpoint: noteId != null ? `/api/notes/${noteId}` : `/api/notes`,
    method: noteId != null ? 'PUT' : 'POST',
  })
  const [isDeleting, deleteNote] = useMutation({
    endpoint: `/api/notes/${noteId}`,
    method: 'DELETE',
  })

  // sync client text in editor between navigation
  useEffect(() => {
    if (title !== initialTitle) {
      setTitle(initialTitle)
    }
    if (body !== initialBody) {
      setBody(initialBody)
    }
  }, [initialTitle, initialBody])

  async function handleSave() {
    const payload = { title, body }
    const requestedLocation = {
      selectedId: noteId,
      isEditing: false,
    }

    const response = await saveNote(payload, requestedLocation)
    const updatedData = await response.json()
    const finalId = noteId || updatedData.id
    navigate(`${finalId ? `/note/${finalId}` : '/'}`)
  }

  async function handleDelete() {
    const payload = {}
    const requestedLocation = {
      selectedId: null,
      isEditing: false,
    }

    await deleteNote(payload, requestedLocation)
    navigate('/')
  }

  async function navigate(url) {
    router.push(url)
  }

  const isDraft = !noteId
  return (
    <div className="note-editor">
      <form
        className="note-editor-form"
        autoComplete="off"
        onSubmit={e => e.preventDefault()}
      >
        <label className="offscreen" htmlFor="note-title-input">
          Enter a title for your note
        </label>
        <input
          id="note-title-input"
          type="text"
          value={title}
          onChange={e => {
            setTitle(e.target.value)
          }}
        />
        <label className="offscreen" htmlFor="note-body-input">
          Enter the body for your note
        </label>
        <textarea
          value={body}
          id="note-body-input"
          onChange={e => setBody(e.target.value)}
        />
      </form>
      <div className="note-editor-preview">
        <div className="note-editor-menu" role="menubar">
          <button
            className="note-editor-done"
            disabled={Boolean(isSaving)}
            onClick={() => handleSave()}
            role="menuitem"
          >
            <img
              src="/checkmark.svg"
              width="14px"
              height="10px"
              alt=""
              role="presentation"
            />
            Done
          </button>
          {!isDraft && (
            <button
              className="note-editor-delete"
              disabled={Boolean(isDeleting)}
              onClick={() => handleDelete()}
              role="menuitem"
            >
              <img
                src="/cross.svg"
                width="10px"
                height="10px"
                alt=""
                role="presentation"
              />
              Delete
            </button>
          )}
        </div>
        <div className="label label--preview" role="status">
          Preview
        </div>
        <h1 className="note-title">{title}</h1>
        <NotePreview title={title} body={body} />
      </div>
    </div>
  )
}

function useMutation({ endpoint, method }) {
  const [isSaving, setIsSaving] = useState(false)
  const [didError, setDidError] = useState(false)
  const [error, setError] = useState(null)
  if (didError) {
    // Let the nearest error boundary handle errors while saving.
    throw error
  }

  async function performMutation(payload) {
    setIsSaving(true)
    try {
      const response = await fetch(`${endpoint}`, {
        method,
        body: JSON.stringify(payload),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      return response
    } catch (e) {
      console.error(e)
      setDidError(true)
      setError(e)
    } finally {
      setIsSaving(false)
    }
  }

  return [isSaving, performMutation]
}
