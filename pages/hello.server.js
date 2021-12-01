import { Suspense } from 'react'
import Test from '../components/test.client'

export default function Hello() {
  return (
    <div>
      asdasd
      <Suspense><Test /></Suspense>
    </div>
  )
}