import { default as argon2 } from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import { FormError } from '../lib/backend/errors'

import { environment } from '../environments';
import { User } from '../entities';
import { sendEmail, Time } from '../functions';
import { AppContext, RedisKey } from '../types';
import {
  UserChangePasswordInput,
  UserCreateInput,
  UserLoginInput
} from './graphql-types';

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async userChangePassword(
    @Arg('input') input: UserChangePasswordInput,
    @Ctx() { entityManager, redis, request }: AppContext
  ): Promise<User> {
    input.throwIfInvalid();
    const { password, token } = input;
    const userId = await redis.get(`${RedisKey.forgotPassword}:${token}`);
    const user = (!userId) ? null : await entityManager.findOne(User, { id: parseInt(userId, 10) });
    if (!user) {
      throw new FormError({
        children: { token: { control: [ 'Invalid token, please request to change your password again.' ] } }
      });
    }

    user.password = await this.hashPassword(password);

    await entityManager.persistAndFlush(user);

    // log user in
    request.session.userId = user.id;

    await redis.del(`${RedisKey.forgotPassword}:${token}`);
    await sendEmail({
      from: 'lireddit@lireddit.com',
      html: [
        `Your password has been sucessfully updated!`
      ].join('\n'),
      subject: 'Password Change Complete',
      to: user.email
    });

    return user;
  }

  @Mutation(() => User)
  async userCreate(
    @Arg('input') input: UserCreateInput,
    @Ctx() { entityManager, request }: AppContext
  ): Promise<User> {
    input.throwIfInvalid();
    const { email, password, username } = input;

    const existingUser = await entityManager.findOne(User, {
      $or: [ { username }, { email: username }, { email }, { username: email } ]
    });
    if (existingUser) {
      throw new FormError({
        children: { username: { control: [ 'Username already exists.' ] } }
      });
    }

    const user = entityManager.create(User, {
      email,
      password: await this.hashPassword(password),
      username
    });
    await entityManager.persistAndFlush(user);

    request.session.userId = user.id;

    return user;
  }

  @Query(() => User, { nullable: true })
  async userDetails(
    @Ctx() { entityManager, request }: AppContext
  ): Promise<User | null> {
    const userId = request.session.userId;

    return (userId)
      ? await entityManager.findOne(User, { id: userId })
      : null;
  }

  @Mutation(() => Boolean)
  async userForgotPassword(
    @Arg('input') input: string,
    @Ctx() { entityManager, redis }: AppContext
  ): Promise<true> {
    const user = await entityManager.findOne(User, { $or: [ { username: input }, { email: input } ] });
    if (!user) {
      throw new FormError({
        children: { input: { control: [ 'Email/Username does not exist.' ] } }
      });
    }

    const token = v4();
    await redis.set(`${RedisKey.forgotPassword}:${token}`, user.id, 'ex', Time.converters.fromDay(3));

    await sendEmail({
      from: 'lireddit@lireddit.com',
      html: [
        `<a href="${environment.urls.app}/change-password/${token}">Change Password</a>`
      ].join('\n'),
      subject: 'Password Change Request',
      to: user.email
    });

    return true;
  }

  @Mutation(() => User)
  async userLogin(
    @Arg('input') input: UserLoginInput,
    @Ctx() { entityManager, request }: AppContext
  ): Promise<User> {
    input.throwIfInvalid();
    const { password, username } = input;
    const existingUser = await entityManager.findOne(User, { $or: [ { username }, { email: username } ] });

    if (!existingUser || !await argon2.verify(existingUser.password, password)) {
      throw new FormError({
        control: [ 'Invalid username or password.' ]
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

  /** Hashes the provided password before it is stored in the database. */
  protected hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}