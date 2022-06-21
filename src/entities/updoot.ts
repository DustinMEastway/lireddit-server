import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn
} from 'typeorm';

import { Post } from './post';
import { User } from './user';

@Entity()
@ObjectType()
export class Updoot extends BaseEntity {
  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.updoots)
  post: Post;

  @Field()
  @PrimaryColumn()
  postId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.updoots, {
    onDelete: 'CASCADE'
  })
  user: User;

  @Field()
  @PrimaryColumn()
  userId: number;

  @Field()
  @Column({ type: 'int' })
  vote: -1 | 1;
}
