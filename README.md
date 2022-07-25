# Next.js 12 React Server Components Notes Demo (Alpha)

Try the demo live here: [**next-rsc-notes.vercel.app**](https://next-rsc-notes.vercel.app).

> **Warning**  
> This demo is built for showing what features that Server Components provide and what the application structure might look like.  
> **It's not ready for production adoption, or performance benchmarking** as the underlying APIs are not stable yet, and might change or be improved in the future. 

## Introduction

This is a demo app showing Next.js 12's experimental React Server Components support. It's based on the [React Server Components Demo](https://github.com/reactjs/server-components-demo) by the React team. We recommend you taking a look at these links, before trying out the experimental feature:
- [**Introducing Zero-Bundle-Size React Server Components**](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html)
- [**Everything About React Server Components**](https://vercel.com/blog/everything-about-react-server-components)
- [**Docs of React Server Components in Next.js**](https://nextjs.org/docs/advanced-features/react-18#react-server-components)

## Technical Details

This Next.js application uses React 18 (RC build), with `runtime` set to `'nodejs'` and feature flag `serverComponents` enabled. You can check out [next.config.js](https://github.com/vercel/server-components-notes-demo/blob/main/next.config.js) for more details. It also uses Redis to store the data, and GitHub's OAuth API for authentication. To develop it locally or host it, please follow these instructions:

### Preparation

These environment variables are required to start this application (you can create a `.env` file for Next.js to use):

```bash
REDIS_URL='rediss://:<password>@<url>:<port>' # or `redis://` if no TLS support
SESSION_KEY='your session key'
OAUTH_CLIENT_KEY='github oauth app id'
OAUTH_CLIENT_SECRET='github oauth app secret'
```

### Running Locally

1. `yarn install`
2. `yarn dev`

Go to `localhost:3000`.

### Deploy

You can quickly deploy the demo to Vercel by clicking this link:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fserver-components-notes-demo&env=REDIS_URL,SESSION_KEY,OAUTH_CLIENT_KEY,OAUTH_CLIENT_SECRET&project-name=next-rsc-notes&repo-name=next-rsc-notes&demo-title=React%20Server%20Components%20(Experimental%20Demo)&demo-description=Experimental%20demo%20of%20React%20Server%20Components%20with%20Next.js.%20&demo-url=https%3A%2F%2Fnext-rsc-notes.vercel.app&demo-image=https%3A%2F%2Fnext-rsc-notes.vercel.app%2Fog.png)

## Technical Details

This Next.js application uses React 18 (RC build) and the new [Edge Runtime](https://nextjs.org/docs/api-reference/edge-runtime). It has `runtime` set to `'edge'` and feature flag `serverComponents` enabled. You can check out [next.config.js](https://github.com/vercel/next-server-components/blob/main/next.config.js) for more details.

## License

This demo is MIT licensed.
