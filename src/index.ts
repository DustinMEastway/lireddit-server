import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { default as express, Express } from 'express';
import { buildSchema } from 'type-graphql';

import { environment } from './environments';
import { default as mikroOrmConfig }  from './mikro-orm.config';
import { resolvers } from './resolvers';
import { AppContext } from './types';

async function addGraphQlMiddleware(app: Express): Promise<void> {
  const orm = await MikroORM.init(mikroOrmConfig);
  // run the migration scripts
  await orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    context: (): AppContext => ({
      entityManager: orm.em
    }),
    schema: await buildSchema({
      resolvers,
      validate: false
    })
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

async function main(): Promise<void> {
  const app = express();
  await addGraphQlMiddleware(app);

  app.listen(environment.port, (): void => {
    console.log(`Server listening on localhost:${environment.port}`);
  });
}

main();
