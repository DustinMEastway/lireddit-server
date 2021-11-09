import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { default as express } from 'express';
import { buildSchema } from 'type-graphql';

import { environment } from './environments';
import { default as mikroOrmConfig }  from './mikro-orm.config';
import { HelloResolver } from './resolvers';

async function main(): Promise<void> {
  const orm = await MikroORM.init(mikroOrmConfig);
  // run the migration scripts
  await orm.getMigrator().up();

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ HelloResolver ],
      validate: false
    })
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(environment.port, (): void => {
    console.log(`Server listening on localhost:${environment.port}`);
  });
}

main();
