import { default as argon2 } from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { v4 } from 'uuid';

import { environment } from '../environments';
import { User } from '../entities';
import { sendEmail, Time } from '../functions';
import { AppContext, FormControlError, RedisKey } from '../types';
import { UserCreateInput, UserLoginInput } from './input-types';

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
    @Arg('input') input: UserLoginInput,
    @Ctx() { entityManager, request }: AppContext
  ): Promise<User> {
    input.validate();
    const { password, username } = input;
    const existingUser = await entityManager.findOne(User, { $or: [ { username }, { email: username } ] });
    if (!existingUser || !await argon2.verify(existingUser.password, password)) {
      throw new FormControlError({
        errors: [ 'Invalid username or password.' ]
      });
    }

    request.session.userId = existingUser.id;

    return existingUser;
  }

  @Mutation(() => Boolean)
  userLogout(
    @Ctx() { request, response }: AppContext
  ): Promise<boolean> {
    return new Promise((resolve) => {
      request.session.destroy((error) => {
        response.clearCookie(environment.cookieName);
        if (error) {
          console.warn('error', error);
        }

        resolve(!error);
      });
    });
  }

  @Mutation(() => User)
  async userCreate(
    @Arg('input') input: UserCreateInput,
    @Ctx() { entityManager, request }: AppContext
  ): Promise<User> {
    input.validate();
    const { email, password, username } = input;

    const existingUser = await entityManager.findOne(User, {
      $or: [ { username }, { email: username }, { email }, { username: email } ]
    });
    if (existingUser) {
      throw new FormControlError({
        children: { username: [ 'Username already exists.' ] }
      });
    }

    const user = entityManager.create(User, {
      email,
      password: await argon2.hash(password),
      username
    });
    await entityManager.persistAndFlush(user);

    request.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  async userRequestChangePassword(
    @Arg('email') email: string,
    @Ctx() { entityManager, redis }: AppContext
  ): Promise<boolean> {
    const user = await entityManager.findOne(User, { email });
    if (!user) {
      throw new FormControlError({
        children: { email: [ 'Email does not exist.' ] }
      });
    }

    const token = v4();
    await redis.set(`${RedisKey}:${token}`, user.id, 'ex', Time.converters.fromDay(3));

    await sendEmail({
      from: 'lireddit@lireddit.com',
      html: [
        `<a href="http://localhost:3000/change-password/${token}">Change Password</a>`
      ].join('\n'),
      subject: 'Password Change Request',
      to: email
    });

    return true;
  }
}