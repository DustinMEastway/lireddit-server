import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { EntityManager as PostgresqlEntityManager } from '@mikro-orm/postgresql';
import { Request, Response } from 'express';
import { Redis } from 'ioredis';

declare module 'express-session' {
  /** Declare additional session properties using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). */
  interface SessionData {
    userId: number;
  }
}

export interface AppContext {
  entityManager: EntityManager<IDatabaseDriver<Connection>> & PostgresqlEntityManager;
  redis: Redis;
  request: Request;
  response: Response;
}
