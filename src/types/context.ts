import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';

declare module 'express-session' {
  /** Declare additional session properties using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). */
  interface SessionData {
    userId: number;
  }
}

export interface AppContext {
  entityManager: EntityManager<IDatabaseDriver<Connection>>;
  request: Request;
  response: Response;
}
