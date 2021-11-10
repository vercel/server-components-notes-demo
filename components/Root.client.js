import { useState, cloneElement } from 'react'
import App from './App.server'
// import { ErrorBoundary } from 'react-error-boundary'

// import { useServerResponse } from './Cache.client'
// import { LocationContext } from './LocationContext.client'


export default function Root(props) {
  const [location, setLocation] = useState({
    selectedId: null,
    isEditing: false,
    searchText: '',
  })
  // const response = useServerResponse(location)
  // const root = response.readRoot()

  return (
    <App {...props} />
    // <LocationContext.Provider value={[location, setLocation]}>
    //   {/* {cloneElement(children)} */}
    // </LocationContext.Provider>
  )
}

// function Error({ error }) {
//   return (
//     <div>
//       <h1>Application Error</h1>
//       <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
//     </div>
//   )
// }
