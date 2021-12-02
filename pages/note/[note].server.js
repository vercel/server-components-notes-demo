import { Suspense } from 'react'
import Note from '../../components/Note.server'

import NoteSkeleton from '../../components/NoteSkeleton'
import Page from '../../components/Page.server'

export default function NotePage({login, isEditing = false, router }) {
  const { pathname } = router
  const selectedId = pathname.replace('/note/', '')
  // TODO: get login information from request
  login = process.env.LOGIN

  return (
    <Page login={login}>
      <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
        <Note login={login} selectedId={selectedId} isEditing={isEditing} />
      </Suspense>
    </Page>
  )
}
