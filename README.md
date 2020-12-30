# React Server Components in Next.js

React Server Components + Next.js running in a lambda.

## How does it work?

Application APIs:
- `GET,POST /api/notes` (get all notes, create new note)
- `GET,PUT,DELETE /api/notes/<note_id>` (action for a specific note)

React Server Components API (pages/api/index.js):
- `GET /api` (render application and return the serialized components)

Note that some of the application APIs (POST,PUT,DELETE) will render and return the serialized components as well. The render logic is handled by libs/send-res.src.js.

libs/send-res.src.js accepts the props (from `req.query.location` and `req.session.login`) that needs to be rendered by components/App.server.js (the component tree entry). It then renders the tree and stream it to `res` using:

```js
pipeToNodeWritable(React.createElement(ReactApp, props), res, moduleMap)
```

`moduleMap` is generated by client-side Webpack (in our case, Next.js). It traversals both .server.js and .client.js and generates the full module map from `react-server-dom-webpack/plugin` Webpack plugin (see next.config.js). 
We then use a custom plugin to copy it to /public, then we can access it from the lambda (since lambda's and Next.js' build processes are separated).

Also `ReactApp` is a special build of components/App.server.js, which stripes all the client components (into some special module) because they're not accessible from the server. We bundled it together with libs/send-res.src.js via another Webpack loader into libs/send-res.server.js. The Webpack plugin is under scripts/.

Finally, everything related to OAuth is inside pages/api/auth.js. It's basically a cookie-based session.

## Caveats

- Only `.js` extension is supported.
- Client / server components should be under the `components` directory.

## Development
### Prepare

You need these environment variables to run this app (you can create a `.env` file):

```
REDIS_URL='rediss://:<password>@<url>:<port>' // or `redis://` if no TLS
ENDPOINT='http://localhost:3000'              // need to be absolute url to run in prod/local
NEXT_PUBLIC_ENDPOINT='http://localhost:3000'  // same as above
SESSION_KEY='<random key for cookie-based session>'
OAUTH_CLIENT_KEY='github oauth app id'
OAUTH_CLIENT_SECRET='github oauth app secret'
```

## Development

1. `yarn install` (this will trigger the postinstall command)
2. `vercel dev`
