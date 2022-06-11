import { Suspense } from 'react'
import { useData } from '../libs/use-fetch'
import { getUser } from '../libs/session'
import NoteSkeleton from './NoteSkeleton'
import Page from './Page.server'
import NoteUI from './NoteUI.server'

const defaultNote = {
  title: 'Untitled',
  body: '',
}

export default function EditNote({ login, id, searchText }) {
  let selectedId = id
  const apiKey = `/api/notes/${selectedId}`

  let note =
    selectedId
      ? useData(apiKey, url => fetch(url).then(res => res.json()))
      : defaultNote

  note = note || defaultNote

  const isCreator = !selectedId || note.created_by === login

  return (
    <Page login={login} searchText={searchText}>
      <Suspense fallback={<NoteSkeleton isEditing={isCreator} />}>
        <NoteUI note={note} isEditing={isCreator} selectedId={selectedId} />
      </Suspense>
    </Page>
  )
}

export async function getServerSideProps({ query, req }) {
  return {
    props: {
      login: getUser(req.cookies),
      id: query.id || '',
    },
  }
}
