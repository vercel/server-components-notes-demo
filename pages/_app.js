//import Head from 'next/head'
import '../style.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <Head> */}
        <title>React Server Components (Experimental Demo)</title>
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content="Experimental demo of React Server Components in Next.js. Hosted on Vercel."
        />
        <meta
          name="og:description"
          content="Experimental demo of React Server Components in Next.js. Hosted on Vercel."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://next-server-components.vercel.app/og.png"
        />
        <meta
          name="twitter:site:domain"
          content="https://next-server-components.vercel.app"
        />
        <meta
          name="twitter:url"
          content="https://next-server-components.vercel.app/og.png"
        />
        <meta
          name="og:title"
          content="React Server Components (Experimental Demo)"
        />
        <meta
          name="og:image"
          content="https://next-server-components.vercel.app/og.png"
        />
      {/* </Head> */}
      <Component {...pageProps} />
    </>
  )
}
