import { MikroORM } from '@mikro-orm/core';
import { default as path } from 'path';

import { Post } from './entities';
import { environment } from './environments';

const db = environment.database;

export default {
  dbName: db.name,
  debug: !environment.prod,
  entities: [ Post ],
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[jt]s$/
  },
  type: db.type
} as Parameters<typeof MikroORM.init>[0];
