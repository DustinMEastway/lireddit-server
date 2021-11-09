import { MikroORM } from '@mikro-orm/core';

import { default as mikroOrmConfig }  from './mikro-orm.config';

async function main(): Promise<void> {
  const orm = await MikroORM.init(mikroOrmConfig);

  // run the migration scripts
  await orm.getMigrator().up();
}

main();
