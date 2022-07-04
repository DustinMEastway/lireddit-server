import { Request, Response } from 'express';
import { Redis } from 'ioredis';

import {
  createUpdootDataLoader,
  createUserDataLoader
} from '../data-loaders';

declare module 'express-session' {
  /** Declare additional session properties using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). */
  interface SessionData {
    userId: number;
  }
}

export interface AppContext {
  dataLoaders: {
    updootLoader: ReturnType<typeof createUpdootDataLoader>;
    userLoader: ReturnType<typeof createUserDataLoader>;
  };
  redis: Redis;
  request: Request;
  response: Response;
}
