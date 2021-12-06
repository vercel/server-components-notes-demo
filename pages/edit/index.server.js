import { Suspense } from 'react'
// import Note from '../components/Note'
// import NoteEditor from '../../components/NoteEditor'
import NoteEditor from '../../components/NoteEditor.client'
import NoteSkeleton from '../../components/NoteSkeleton'
import Page from '../../components/Page.server'
import { getUser } from '../../libs/session'

export default function NotePage({login, isEditing = true}) {
  return (
    <Page login={login}>
      <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
        {/* <Note login={login} selectedId={selectedId} isEditing={isEditing} /> */}
        
        <NoteEditor noteId={null} initialTitle="Untitled" initialBody="" />
      </Suspense>
    </Page>
  )
}

export async function getServerSideProps({ req }) {
  return {
    props: { login: getUser(req) }
  }
}