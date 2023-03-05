import NoteUI from 'components/note-ui'

export const metadata = {
  robots: {
    index: false
  }
}

export default async function EditPage() {
  const defaultNote = {
    title: 'Untitled',
    body: ''
  }

  return <NoteUI note={defaultNote} isEditing={true} />
}
