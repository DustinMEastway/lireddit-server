import { Arg, Mutation, Query, Resolver } from 'type-graphql';

import { Post } from '../entities';

@Resolver()
export class PostResolver {
  @Mutation(() => Post)
  async postCreate(
    @Arg('title') title: string
  ): Promise<Post> {
    return await Post.create({ title }).save();
  }

  @Mutation(() => Boolean)
  async postDelete(
    @Arg('id') id: number
  ): Promise<boolean> {
    return ((await Post.delete({ id }))?.affected ?? 0) > 0;
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id') id: number
  ): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }

  @Mutation(() => Post, { nullable: true })
  async postUpdate(
    @Arg('id') id: number,
    @Arg('title') title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });
    if (!post || !title) {
      return post;
    }

    await Post.update({ id }, { title });

    return post;
  }

  @Query(() => [ Post ])
  posts(): Promise<Post[]> {
    return Post.find();
  }
}