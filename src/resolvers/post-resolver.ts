import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';

import { Post } from '../entities';
import { FormError } from '../lib/backend/errors'
import { isAuthenticated } from '../middleware';
import { AppContext } from '../types';
import {
  PostCreateInput,
  PostDeleteInput,
  PostInput,
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
    @Arg('input', () => PostInput) input: PostInput,
    @Ctx() { request }: AppContext
  ): Promise<Post | null> {
    input.throwIfInvalid();
    const { id } = input;
    const { userId } = request.session;

    const post = await Post.createQueryBuilder('post')
      .where('post.id = :id', { id })
      .leftJoinAndSelect(
        'post.updoots',
        'updoot',
        'updoot.userId = :userId',
        { userId }
      )
      .leftJoinAndSelect('post.creator', 'user')
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
    @Arg('input', () => PostListInput, { nullable: true }) input: PostListInput | null,
    @Ctx() { request }: AppContext
  ): Promise<PostListOutput> {
    input?.throwIfInvalid();
    let { cursor, limit } = { ...input };
    let query = Post
      .createQueryBuilder('post');

    if (cursor) {
      query = query.where('post.createdAt < :cursor', { cursor: new Date(parseInt(cursor)) })
    }

    limit = limit ?? PostListInput.defaultLimit;
    const { userId } = request.session;
    const posts = await query
        .orderBy('post.createdAt', 'DESC')
        // try to get an extra to populate `hasMore`
        .take(limit + 1)
        .leftJoinAndSelect(
          'post.updoots',
          'updoot',
          'updoot.userId = :userId',
          { userId }
        )
        .leftJoinAndSelect('post.creator', 'user')
        .getMany();

    return {
      hasMore: posts.length > limit,
      items: posts.slice(0, limit)
    };
  }
}