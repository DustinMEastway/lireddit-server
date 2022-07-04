import { Ctx, Field, ObjectType, Root } from 'type-graphql';
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

  @Field(() => User, { name: 'creator' })
  creatorField(
    @Root() post: Post,
    @Ctx() { dataLoaders: { userLoader } }: AppContext
  ): Promise<User> {
    return userLoader.load(post.creatorId);
  }

  @Field(() => String)
  textSnippet(): string {
    const newLineI = this.text.indexOf('\n');
    return (newLineI < 0) ? this.text : this.text.slice(0, newLineI);
  }

  @Field(() => Number)
  async userVote(
    @Root() post: Post,
    @Ctx() { dataLoaders: { updootLoader }, request }: AppContext
  ): Promise<number> {
    const { userId } = request.session;
    if (!userId) {
      return 0;
    }

    return (await updootLoader.load({
      postId: post.id,
      userId: userId
    }))?.vote ?? 0;
  }
}
