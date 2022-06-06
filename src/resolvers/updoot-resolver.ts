import {
  Arg,
  Ctx,
  Mutation,
  Resolver,
  UseMiddleware
} from 'type-graphql';

import { Post, Updoot } from '../entities';
import { isAuthenticated } from '../middleware';
import { AppContext } from '../types';
import { UpdootVoteInput } from './graphql-types';

@Resolver()
export class UpdootResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async updootVote(
    @Arg('input') input: UpdootVoteInput,
    @Ctx() { request }: AppContext
  ): Promise<boolean> {
    input.throwIfInvalid();
    const { postId, vote } = input;
    const { userId } = request.session;

    const existingUpdoot = await Updoot.findOne({ where: { postId, userId }});
    if ((existingUpdoot?.vote ?? 0) === vote) {
      return true;
    } else if (vote === 0) {
      await Updoot.delete({ postId, userId });
    } else if (existingUpdoot) {
      await Updoot.update({ postId, userId }, { vote });
    } else {
      await Updoot.create({
        postId,
        userId,
        vote
      }).save();
    }

    const voteDiff = (vote - (existingUpdoot?.vote ?? 0));
    await Post.query(`
      UPDATE post
      SET votes = votes + $2
      WHERE id = $1
    `, [ postId, voteDiff ]);
    return true;
  }
}
