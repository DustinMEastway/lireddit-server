import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Post } from '../entities';
import { AppContext } from '../types';

@Resolver()
export class PostResolver {
  @Mutation(() => Post)
  async postCreate(
    @Arg('title') title: string,
    @Ctx() { em }: AppContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async postDelete(
    @Arg('id') id: number,
    @Ctx() { em }: AppContext
  ): Promise<boolean> {
    return await em.nativeDelete(Post, { id }) === 1;
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: number,
    @Ctx() { em }: AppContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post, { nullable: true })
  async postUpdate(
    @Arg('id') id: number,
    @Arg('title') title: string,
    @Ctx() { em }: AppContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }

    post.title = title;
    await em.persistAndFlush(post);
    return post;
  }

  @Query(() => [ Post ])
  posts(@Ctx() { em }: AppContext): Promise<Post[]> {
    return em.find(Post, {});
  }
}