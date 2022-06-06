import { Ctx, Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { AppContext } from '../types';
import { Post } from './post';
import { Updoot } from './updoot';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true })
  email!: string;

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field(() => String, { name: 'email', nullable: true })
  emailField(
    @Ctx() { request }: AppContext
  ): string | null {
    return (request.session.userId === this.id) ? this.email : null;
  }
}
