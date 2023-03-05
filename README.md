# Next.js 13 + React Server Components Notes Demo

Try the demo live here: [**next-rsc-notes.vercel.app**](https://next-rsc-notes.vercel.app).

> **Warning**: This demo showcases using Server Components with the `app` directory inside Next.js 13. **It's not ready for production adoption, or performance benchmarking** as the underlying APIs are not stable yet, and might change or be improved in the future.

This demo was originally [built by the React team](https://github.com/reactjs/server-components-demo). This version has been forked and modified for use with the Next.js App Router.

## Introduction

This is a demo app of a notes application, which shows Next.js 13's `app` directory (beta) with support for React Server Components.

[Learn more](https://beta.nextjs.org/docs/rendering/server-and-client-components).

### Environment Variables

These environment variables are required to start this application (you can create a `.env` file for Next.js to use):

```bash
REDIS_URL='rediss://:<password>@<url>:<port>' # or `redis://` if no TLS support
SESSION_KEY='your session key'
OAUTH_CLIENT_KEY='github oauth app id'
OAUTH_CLIENT_SECRET='github oauth app secret'
```

### Running Locally

1. `pnpm install`
2. `pnpm dev`

Go to `localhost:3000`.

### Deploy

You can quickly deploy the demo to Vercel by clicking this link:

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fserver-components-notes-demo&env=REDIS_URL,SESSION_KEY,OAUTH_CLIENT_KEY,OAUTH_CLIENT_SECRET&project-name=next-rsc-notes&repo-name=next-rsc-notes&demo-title=React%20Server%20Components%20(Experimental%20Demo)&demo-description=Experimental%20demo%20of%20React%20Server%20Components%20with%20Next.js.%20&demo-url=https%3A%2F%2Fnext-rsc-notes.vercel.app&demo-image=https%3A%2F%2Fnext-rsc-notes.vercel.app%2Fog.png>)

## License

This demo is MIT licensed. Originally [built by the React team](https://github.com/reactjs/server-components-demo)
