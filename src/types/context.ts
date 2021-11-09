import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';

export interface AppContext {
  em: EntityManager<IDatabaseDriver<Connection>>;
}