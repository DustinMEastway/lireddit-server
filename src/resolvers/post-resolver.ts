import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';

import { Post } from '../entities';
import { isAuthenticated } from '../middleware';
import { AppContext } from '../types';
import {
  PostCreateInput,
  PostListInput,
  PostListOutput
} from './graphql-types';

@Resolver()
export class PostResolver {
  @Mutation(() => Post)
  @UseMiddleware(isAuthenticated)
  async postCreate(
    @Arg('input') input: PostCreateInput,
    @Ctx() { request }: AppContext
  ): Promise<Post> {
    input.throwIfInvalid();
    return await Post.create({
      ...input,
      creatorId: request.session.userId
    }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
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
  @UseMiddleware(isAuthenticated)
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

  @Query(() => PostListOutput)
  async postList(
    @Arg('input', () => PostListInput, { nullable: true }) input: PostListInput | null
  ): Promise<PostListOutput> {
    input?.throwIfInvalid();
    let { cursor, limit } = { ...input };
    let query = Post
      .createQueryBuilder('post');

    if (cursor) {
      query = query.where('post.createdAt < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    limit = limit ?? PostListInput.defaultLimit;
    const posts = await query
        .orderBy('post.createdAt', 'DESC')
        // try to get an extra to populate `hasMore`
        .take(limit + 1)
        .leftJoinAndSelect('post.creator', 'user')
        .getMany();

    return {
      hasMore: posts.length > limit,
      items: posts.slice(0, limit)
    };
  }
}