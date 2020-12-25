# React Server Components in Next.js

1. You need these environment variables to run this app:

```
REDIS_URL='rediss://:<password>@<url>:<port>'
ENDPOINT='http://localhost:3000' // <- need to be absolute url to run in prod/local
```

2. Modify `endpoint` in components/Cache.client.js:4 based on your environment.

- dev: `yarn dev`
- build: `yarn build`
- start: `yarn start`
