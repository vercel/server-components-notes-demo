import { Suspense } from 'react'
import Note from '../components/Note'
import NoteSkeleton from '../components/NoteSkeleton'
import Page from '../components/Page.server'

export default function NotePage({login, selectedId = null, isEditing = false}) {
  return (
    <Page>
      <Suspense fallback={<NoteSkeleton isEditing={isEditing} />}>
        <Note login={login} selectedId={selectedId} isEditing={isEditing} />
      </Suspense>
    </Page>
  )
}

// export function getServerSideProps({ req }) {
//   // console.log('req.cookies', req)
//   // TODO: fix crash when login is undefined
//   // const login = req?.cookies['session'] || false
//   // console.log('login', login)
//   return {
//     props: {
//       login: false
//     }
//   }
// }
