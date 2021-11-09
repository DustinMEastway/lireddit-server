import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class Post {
  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field()
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'text' })
  title!: string;

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();
}
