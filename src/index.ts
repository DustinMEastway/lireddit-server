import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import { default as connectRedis } from 'connect-redis';
import { default as cors } from 'cors';
import { default as express, Express } from 'express';
import { default as expressSession } from 'express-session';
import { default as redis } from 'redis';
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
    context: ({ req, res }): AppContext => ({
      entityManager: orm.em as AppContext['entityManager'],
      request: req,
      response: res
    }),
    schema: await buildSchema({
      resolvers,
      validate: false
    })
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });
}

async function addRedisSessionMiddleware(app: Express): Promise<void> {
  const expressSessionSecret = process.env.EXPRESS_SESSION_SECRET;
  if (typeof expressSessionSecret !== 'string' || !expressSessionSecret.trim()) {
    throw new Error(`Environmental variable 'EXPRESS_SESSION_SECRET' is required.`);
  }

  const RedisStore = connectRedis(expressSession)
  const dayInMilliseconds = 24 * 60 * 60 * 1000;

  app.use(
    expressSession({
      name: 'qid',
      cookie: {
        httpOnly: true,
        maxAge: 30 * dayInMilliseconds,
        sameSite: 'lax',
        secure: environment.prod
      },
      resave: false,
      saveUninitialized: false,
      secret: expressSessionSecret,
      store: new RedisStore({
        client: redis.createClient(),
        disableTouch: true
      })
    })
  );
}

async function main(): Promise<void> {
  const app = express();

  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }))
  await addRedisSessionMiddleware(app);
  await addGraphQlMiddleware(app);

  app.listen(environment.port, (): void => {
    console.log(`Server listening on localhost:${environment.port}`);
  });
}

main();
