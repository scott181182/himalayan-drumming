# Himalayan Drumming Research Dashboard

The Himalayan Drumming Research Dashboard is a web application developed for [Dr. Stefan Fiol](https://researchdirectory.uc.edu/p/fiolsn), originally as Scott Fasone's CS Masters Project under [Dr. Jillian Aurisano](https://researchdirectory.uc.edu/p/aurisajm). The goal of the application is to provide Dr. Fiol (and other ethnomusicologists) with a dashboard for storing, categorizing, and analyzing data they collect on drumming in the [Garhwal](https://en.wikipedia.org/wiki/Garhwal_division) region of the Himalayas in order to spawn research questions and simplify data interrogation. Initial data includes:

- video and audio recordings of drummers, including location
- notes on recordings
- villages in the region
- performers and genealogical relations of performers
- the relations between recordings, performers, and villages

## Architecture

The diagram below shows the current (development) architecture of the application.

![Architecture Diagram](./diagram/architecture-bg.drawio.png)

### Docker Container

The entire application is packaged in a [Docker](https://www.docker.com/) image, for portability and ease of setup. In development mode, it currently forwards port 8080 to the container's port 80, which Nginx will listen on.

### Nginx Reverse Proxy

[Nginx](https://www.nginx.com/) is used to proxy incoming requests to either the frontend or the backend. Any request starting with `/api` is forwarded to the backend Nodejs server on port 3001, while all other requests will default to the frontend on port 3000 to be handled by the single-page application (SPA).

### Frontend

The frontend is written in [React](https://react.dev/) using [Next.js](https://nextjs.org/) for server-side rendering. All applicable code is in [TypeScript](https://www.typescriptlang.org/) instead of JavaScript.

The primary view is an interactive [Leaflet](https://leafletjs.com/) map of the Uttarakhand state in India. UI components are from [Ant Design](https://ant.design/), including two sidebars. The left sidebar is the [file browser](./frontend/src/components/FileBrowser/index.tsx) and the right sidebar contains both the [village browser](./frontend/src/components/VillageBrowser/index.tsx) and the [person browser](./frontend/src/components/PersonBrowser/index.tsx). [Apollo](https://www.apollographql.com/docs/react/) is used for communicating with the backend GraphQL API.

### Backend

The backend is also written in TypeScript running on [Node.js](https://nodejs.org/). The server includes a [GraphQL API](https://graphql.org/) for accessing all data from the database, and a REST API for uploading and fetching files. Both APIs access the database using [Prisma](https://www.prisma.io/) as an object-relational mapper (ORM). The [Prisma schema](./backend/prisma/schema.prisma) is used to define the program's database interface and the database schema itself. The GraphQL API is built using [Nexus](https://nexusjs.org/), which generates the [full schema](./backend/schema.graphql) from the codebase. The REST API (and technically the entire backend) is served using [Express](https://expressjs.com/).

### Database

The database is a relational database currently stored in [SQLite](https://www.sqlite.org/index.html). This should eventually be migrated to an actual relational database management system like [PostgreSQL](https://www.postgresql.org/) for scalability.


### File Storage

Currently the app looks at and serves all research files from the local filesystem. This should probably be migrated to some sort of cloud-based blob storage (like [Amazon S3](https://aws.amazon.com/s3/) or [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs)) in the future.

## Developing
