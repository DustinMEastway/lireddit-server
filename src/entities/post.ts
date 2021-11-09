import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Post {
  @Property({ type: 'date' })
  createdAt = new Date();

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  title!: string;

  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();
}
