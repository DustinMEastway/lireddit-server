import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Post } from '../entities';
import { AppContext } from '../types';

@Resolver()
export class PostResolver {
  @Mutation(() => Post)
  async postCreate(
    @Arg('title') title: string,
    @Ctx() { entityManager }: AppContext
  ): Promise<Post> {
    const post = entityManager.create(Post, { title });
    await entityManager.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async postDelete(
    @Arg('id') id: number,
    @Ctx() { entityManager }: AppContext
  ): Promise<boolean> {
    return await entityManager.nativeDelete(Post, { id }) === 1;
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: number,
    @Ctx() { entityManager }: AppContext
  ): Promise<Post | null> {
    return entityManager.findOne(Post, { id });
  }

  @Mutation(() => Post, { nullable: true })
  async postUpdate(
    @Arg('id') id: number,
    @Arg('title') title: string,
    @Ctx() { entityManager }: AppContext
  ): Promise<Post | null> {
    const post = await entityManager.findOne(Post, { id });
    if (!post) {
      return null;
    }

    post.title = title;
    await entityManager.persistAndFlush(post);
    return post;
  }

  @Query(() => [ Post ])
  posts(@Ctx() { entityManager }: AppContext): Promise<Post[]> {
    return entityManager.find(Post, {});
  }
}