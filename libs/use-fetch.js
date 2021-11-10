const cache = {}

export function useData(key, fetcher) {
  if (!cache[key]) {
    let data
    let promise
    cache[key] = () => {
      console.log('data', data, 'promise', promise)
      if (data !== undefined) return data
      if (!promise) promise = fetcher().then((r) => (data = r))
      throw promise
    }
  }
  return cache[key]()
}

