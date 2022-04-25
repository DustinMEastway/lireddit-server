import { Field, ObjectType } from 'type-graphql';

import { Post } from '../../entities';

@ObjectType()
export class PostListOutput {
  @Field()
  hasMore: boolean;
  @Field(() => [ Post ])
  items: Post[];
}
