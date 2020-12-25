import Head from 'next/head'
import '../style.css'

export default function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>React Server Components</title>
    </Head>
    <Component {...pageProps} />
  </>
}
