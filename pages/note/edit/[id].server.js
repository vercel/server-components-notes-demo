export { getServerSideProps } from '../../../components/EditorPage.server'

// TODO support `export { default }` in next.js
import EditorPage from '../../../components/EditorPage.server'

export default function Editor(props) {
  return <EditorPage {...props} />
}
