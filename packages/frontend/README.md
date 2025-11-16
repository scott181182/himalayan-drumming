# Himalayan Drumming Research Dashboard - Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Development

### Getting Started

Before running the frontend server, the client-side GraphQL code needs generated. After generating the server-side schema (as shown in the [server README](../backend/README.md)), run the following command:

```sh
# Generate the client-side GraphQL types and document nodes.
# This needs ran anytime the server-side GraphQL schema is changed/regnerated.
yarn generate
```

Then you can run the development server! This will live recompile and refresh the browser anytime any files are changed, so no need to re-run this during development.

```bash
# Start the development server.
yarn dev
```

This will start the development server listening on port 3000, which the Dev Container's Nginx instance will forward requests to.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
