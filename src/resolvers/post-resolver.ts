import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { SelectQueryBuilder } from 'typeorm';

import { Post } from '../entities';
import { FormError } from '../lib/backend/errors'
import { isAuthenticated } from '../middleware';
import { AppContext } from '../types';
import {
  PostCreateInput,
  PostDeleteInput,
  PostInput,
  PostListInput,
  PostListOutput,
  PostUpdateInput
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
    @Arg('input') input: PostDeleteInput,
    @Ctx() { request }: AppContext
  ): Promise<boolean> {
    input.throwIfInvalid();
    const { id } = input;
    const deleteResult = await Post.delete({
      id,
      creatorId: request.session.userId
    });

    return (deleteResult?.affected ?? 0) > 0;
  }

  @Query(() => Post, { nullable: true })
  async post(
    @Arg('input', () => PostInput) input: PostInput
  ): Promise<Post | null> {
    input.throwIfInvalid();
    const { id } = input;

    const post = await this.queryPosts()
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new FormError(
        { children: { id: { control: ['No post with the provided ID.'] } } },
        'Post not found.'
      );
    }

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async postUpdate(
    @Arg('input') input: PostUpdateInput,
    @Ctx() { request }: AppContext
  ): Promise<Post | null> {
    input.throwIfInvalid();
    const { id, ...updates } = input;
    const { userId } = request.session;

    const post = await this.queryPosts()
      .where('post.id = :id AND post.creatorId = :userId', { id, userId })
      .getOne();

    if (!post) {
      return post;
    }

    Object.assign(post, { ...updates });
    await Post.update({ id }, { ...updates });

    return post;
  }

  @Query(() => PostListOutput)
  async postList(
    @Arg('input', () => PostListInput, { nullable: true }) input: PostListInput | null
  ): Promise<PostListOutput> {
    input?.throwIfInvalid();
    let { cursor, limit = PostListInput.defaultLimit } = input ?? {};
    let query = await this.queryPosts();

    if (cursor) {
      query = query.where('post.createdAt < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    const posts = await query
        .orderBy('post.createdAt', 'DESC')
        // try to get an extra to populate `hasMore`
        .take(limit + 1)
        .getMany();

    return {
      hasMore: posts.length > limit,
      items: posts.slice(0, limit)
    };
  }

  protected queryPosts(): SelectQueryBuilder<Post> {
    return Post.createQueryBuilder('post')
      // I am using dataloader to get creator as an example even though I prefer this way of getting the data
      // .leftJoinAndSelect('post.creator', 'user');
  }
}