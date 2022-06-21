import { Ctx, Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { AppContext } from '../types';
import { Updoot } from './updoot';
import { User } from './user';

@Entity()
@ObjectType()
export class Post extends BaseEntity {
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column()
  title!: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  @Field()
  @Column({ type: 'int', default: 0 })
  votes!: number;

  @Field(() => String)
  textSnippet(): string {
    const newLineI = this.text.indexOf('\n');
    return (newLineI < 0) ? this.text : this.text.slice(0, newLineI);
  }

  @Field(() => Number)
  userVote(
    @Ctx() { request }: AppContext
  ): number {
    return this.updoots?.find((u) => u.userId === request.session.userId)?.vote ?? 0;
  }
}
