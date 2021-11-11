import { default as argon2 } from 'argon2';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';

import { User } from '../entities';
import { validateString } from '../functions';
import { AppContext, FormControlError } from '../types';

@InputType()
export class UserCreateInput {
  @Field()
  password: string;
  @Field()
  username: string;

  validate(): void {
    const errors: Record<string, string[]> = {};
    this.password = this.password.trim();
    this.username = this.username.trim();

    if ([
      validateString(errors, 'password', this.password, {
        minLength: 3,
        required: true
      }),
      validateString(errors, 'username', this.username, {
        minLength: 3,
        required: true
      })
    ].some(v => !v)) {
      throw new FormControlError({ children: errors });
    }
  }
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async userLogin(
    @Arg('options') options: UserCreateInput,
    @Ctx() { em }: AppContext
  ): Promise<User> {
    options.validate();
    const { password, username } = options;
    const existingUser = await em.findOne(User, { username });
    if (!existingUser || !await argon2.verify(existingUser.password, password)) {
      throw new FormControlError({
        errors: [ 'Invalid username or password.' ]
      });
    }

    return existingUser;
  }

  @Mutation(() => User)
  async userCreate(
    @Arg('options') options: UserCreateInput,
    @Ctx() { em }: AppContext
  ): Promise<User> {
    options.validate();
    const { username, password } = options;

    const existingUser = await em.findOne(User, { username });
    if (existingUser) {
      throw new FormControlError({
        children: { username: [ 'Username already exists.' ] }
      });
    }

    const user = em.create(User, {
      password: await argon2.hash(password),
      username
    });
    await em.persistAndFlush(user);
    return user;
  }
}