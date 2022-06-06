import { PostResolver } from './post-resolver';
import { UpdootResolver } from './updoot-resolver';
import { UserResolver } from './user-resolver';

export const resolvers = [
  PostResolver,
  UpdootResolver,
  UserResolver
] as const;
