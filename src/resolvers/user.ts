import { default as argon2 } from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { User } from '../entities';
import { AppContext, FormControlError } from '../types';
import { UserInput } from './input-types';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async userDetails(
    @Ctx() { entityManager, request }: AppContext
  ): Promise<User | null> {
    const userId = request.session.userId;

    return (userId)
      ? await entityManager.findOne(User, { id: userId })
      : null;
  }

  @Mutation(() => User)
  async userLogin(
    @Arg('options') options: UserInput,
    @Ctx() { entityManager, request }: AppContext
  ): Promise<User> {
    options.validate();
    const { password, username } = options;
    const existingUser = await entityManager.findOne(User, { username });
    if (!existingUser || !await argon2.verify(existingUser.password, password)) {
      throw new FormControlError({
        errors: [ 'Invalid username or password.' ]
      });
    }

    request.session.userId = existingUser.id;

    return existingUser;
  }

  @Mutation(() => User)
  async userCreate(
    @Arg('options') options: UserInput,
    @Ctx() { entityManager, request }: AppContext
  ): Promise<User> {
    options.validate();
    const { username, password } = options;

    const existingUser = await entityManager.findOne(User, { username });
    if (existingUser) {
      throw new FormControlError({
        children: { username: [ 'Username already exists.' ] }
      });
    }

    const user = entityManager.create(User, {
      password: await argon2.hash(password),
      username
    });
    await entityManager.persistAndFlush(user);

    request.session.userId = user.id;

    return user;
  }
}