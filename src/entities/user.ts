import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class User {
  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  email!: string;

  @Field()
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  password!: string;

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();

  @Field()
  @Property({ type: 'text', unique: true })
  username!: string;
}
