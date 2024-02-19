# Himalayan Drumming Research Dashboard - Backend



## Development

### Getting Started

After installing dependencies, the database needs initialized. This can be done with the following commands ran in this directory:

```sh
# Generate the database, overriding any existing one.
# This will create a `dev.db` SQLite file in the `prisma` directory.
npx prisma db push

# Generate the Prisma Client so the server can interface with the database.
yarn generate:prisma

# Seed the database with some necessary initial data.
yarn db:seed
```

This applications serves to provide an interface to interact and explore an existing directory of files. For development, random files including some video files can be placed into the `blob` directory (in the root of the workspace), then the following command can be run to scan and insert necessary data in the database:

```sh
# Scan the root `blob` directory and insert corresponding data into the database.
yarn db:scan
```

With a working database and some seed data, now we can generate the GraphQL API schema that the frontend requires, then build and run the backend server:

```sh
# Generate the GraphQL schema using Nexus.
# This needs to be ran anytime after changing files in the `src/graphql` directory.
yarn generate:nexus

# Build the backend.
# This needs to be ran anytime the source code changes.
yarn build

# Run the currently built server.
yarn start
# OR
node .
```

This will start the server listening on port 3001 in the Dev Container, which Nginx will forward API requests to.

### Common Development Tasks

#### Changing the Database/Prisma Schema

The database schema is controlled by the [`schema.prisma`](./prisma/schema.prisma) file in the [`prisma`](./prisma) directory. Anytime this is changed, you must run the following commands to create a SQL [migration](https://www.prisma.io/docs/orm/prisma-migrate) and update the Prisma Client in the server code:

```sh
# Create a migration and run it against the database.
yarn db:migrate
# Regenerate the Prisma Client.
yarn generate:prisma
```

After the client has been regenerated, you can then proceed to integrate your changes with the server.

#### Changing the GraphQL/Nexus Schema

If GraphQL resolvers, mutations, or objects needs added or modified, then files in the [`src/graphql/schema`](./src/graphql/schema) can be modified. After being modified, re-run the `yarn generate:nexus` command.
