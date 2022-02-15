# React Server Components in Next.js

Experimental app of React Server Components with Next.js, based on [React Server Components Demo](https://github.com/reactjs/server-components-demo).  
**It's not ready for adoption. Use this in your projects at your own risk.**

## Development

### Prepare

You need these environment variables to run this app (you can create a `.env` file):

```
REDIS_URL='rediss://:<password>@<url>:<port>' // or `redis://` if no TLS
SESSION_KEY='random'
OAUTH_CLIENT_KEY='github oauth app id'
OAUTH_CLIENT_SECRET='github oauth app secret'
```

### Start

1. `yarn install` (this will trigger the postinstall command)
2. `yarn dev`

Go to `localhost:3000` to view the application.

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext-server-components&env=REDIS_URLSESSION_KEY,,OAUTH_CLIENT_KEY,OAUTH_CLIENT_SECRET&project-name=next-server-components&repo-name=next-server-components&demo-title=React%20Server%20Components%20(Experimental%20Demo)&demo-description=Experimental%20demo%20of%20React%20Server%20Components%20with%20Next.js.%20&demo-url=https%3A%2F%2Fnext-server-components.vercel.app&demo-image=https%3A%2F%2Fnext-server-components.vercel.app%2Fog.png>)

### Reference

- [How to use Next.js with React Server Components](https://nextjs.org/docs/advanced-features/react-18)


