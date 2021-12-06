import { Suspense } from 'react'
import Note from '../../components/Note.server'

import NoteSkeleton from '../../components/NoteSkeleton'
import Page from '../../components/Page.server'
import { getUser } from '../../libs/session'

export default function NotePage({login, isEditing = false, router }) {
  const { pathname } = router
  const selectedId = pathname.replace('/note/', '')

  return (
    <Page login={login}>
      <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
        <Note login={login} selectedId={selectedId} isEditing={isEditing} />
      </Suspense>
    </Page>
  )
}

export async function getServerSideProps({ req }) {
  return {
    props: { login: getUser(req) }
  }
}