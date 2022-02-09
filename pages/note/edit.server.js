import { Suspense } from 'react'
import { useData } from '../../libs/use-fetch'
import NoteEditor from '../../components/NoteEditor.client'
import NoteSkeleton from '../../components/NoteSkeleton'
import Page from '../../components/Page.server'
import { getUser } from '../../libs/session'

const defaultNote = {
  title: 'Untitled',
  body: '',
}

export default function EditNote({ login, router, searchText }) {
  const selectedId = router.query.id
  const apiKey = `/api/notes/${selectedId}`

  let note = selectedId != null
    ? useData(apiKey, () => fetch(apiKey).then(res => res.json())) 
    : defaultNote

  note = note || defaultNote

  return (
    <Page login={login} searchText={searchText}>
      <Suspense fallback={<NoteSkeleton isEditing />}>
        <NoteEditor noteId={selectedId} initialTitle={note.title} initialBody={note.body} />
      </Suspense>
    </Page>
  )
}

export async function getServerSideProps({ req }) {
  return {
    props: { login: getUser(req) }
  }
}
