import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

export interface AppContext {
  entityManager: EntityManager<IDatabaseDriver<Connection>>;
}
