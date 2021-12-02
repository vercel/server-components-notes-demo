import { Suspense } from 'react'
import { useData } from '../../libs/use-fetch'
import NoteEditor from '../../components/NoteEditor.client'
import NoteSkeleton from '../../components/NoteSkeleton'
import Page from '../../components/Page.server'

export default function EditNote({login, router, isEditing = true}) {
  const selectedId = router.pathname.replace('/edit/', '')
  const apiKey = `${process.env.ENDPOINT}/api/notes/${selectedId}`
  const note = useData(apiKey, () => fetch(apiKey).then(res => res.json()))

  // TODO: get login information from request
  login = process.env.LOGIN

  return (
    <Page login={login}>
      <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
        <NoteEditor noteId={selectedId} initialTitle={note.title} initialBody={note.body} />
      </Suspense>
    </Page>
  )
}
