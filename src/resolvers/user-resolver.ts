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
  UserChangePasswordTokenCheckInput,
  UserCreateInput,
  UserLoginInput
} from './graphql-types';

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async userChangePassword(
    @Arg('input') input: UserChangePasswordInput,
    @Ctx() { redis, request }: AppContext
  ): Promise<User> {
    input.throwIfInvalid();
    const { password, token } = input;
    const user = await this.getUserFromChangePasswordToken(token, redis);
    if (!user) {
      throw new FormError({
        children: { token: { control: [ 'Invalid token, please request to change your password again.' ] } }
      });
    }

    await User.update({ id: user.id }, {
      password: await this.hashPassword(password)
    });

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

  @Query(() => Boolean)
  async userChangePasswordTokenCheck(
    @Arg('input') input: UserChangePasswordTokenCheckInput,
    @Ctx() { redis }: AppContext
  ): Promise<boolean> {
    input.throwIfInvalid();
    return !!await this.getUserFromChangePasswordToken(input.token, redis);
  }

  @Mutation(() => User)
  async userCreate(
    @Arg('input') input: UserCreateInput,
    @Ctx() { request }: AppContext
  ): Promise<User> {
    input.throwIfInvalid();
    const { email, password, username } = input;

    const existingUser = await User.findOne({ where: [
      { username },
      { email: username },
      { email },
      { username: email }
    ] });
    if (existingUser) {
      throw new FormError({
        children: { username: { control: [ 'Username and/or Email already exists.' ] } }
      });
    }

    const user = User.create({
      email,
      password: await this.hashPassword(password),
      username
    });
    await user.save();

    request.session.userId = user.id;

    return user;
  }

  @Query(() => User, { nullable: true })
  async userDetails(
    @Ctx() { request }: AppContext
  ): Promise<User | null> {
    const userId = request.session.userId;

    return (userId)
      ? await User.findOne({ where: { id: userId } })
      : null;
  }

  @Mutation(() => Boolean)
  async userForgotPassword(
    @Arg('input') input: string,
    @Ctx() { redis }: AppContext
  ): Promise<true> {
    const user = await User.findOne({ where: [ { username: input }, { email: input } ] });
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
    @Ctx() { request }: AppContext
  ): Promise<User> {
    input.throwIfInvalid();
    const { password, username } = input;
    const existingUser = await User.findOne({ where: [ { username }, { email: username } ] });

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

  /** Get the user for the provided token if the token and user exist. */
  protected async getUserFromChangePasswordToken(token: string, redis: AppContext['redis']): Promise<User | null> {
    const userId = await redis.get(`${RedisKey.forgotPassword}:${token}`);
    return (!userId) ? null : await User.findOne({ where: { id: parseInt(userId, 10) } });
  }

  /** Hashes the provided password before it is stored in the database. */
  protected hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}