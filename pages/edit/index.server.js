import { Suspense } from 'react'
// import Note from '../components/Note'
// import NoteEditor from '../../components/NoteEditor'
import NoteEditor from '../../components/NoteEditor.client'
import NoteSkeleton from '../../components/NoteSkeleton'
import Page from '../../components/Page.server'

export default function NotePage({login, isEditing = true}) {
  // TODO: get login information from request
  login = process.env.LOGIN

  return (
    <Page login={login}>
      <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
        {/* <Note login={login} selectedId={selectedId} isEditing={isEditing} /> */}
        
        <NoteEditor noteId={null} initialTitle="Untitled" initialBody="" />
      </Suspense>
    </Page>
  )
}
