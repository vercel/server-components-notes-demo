import { useEffect } from 'react'
import { unstable_useRefreshRoot } from 'next/rsc'
import { useRouter } from 'next/router'

export default function AutoRefresh() {
  const router = useRouter()
  const refresh = unstable_useRefreshRoot()
  function handleRouteChangeComplete() {
    refresh()
  }

  // NOTE: leverage routeChangeComplete to make sure the rsc cacheKey is updated
  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.on('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

}