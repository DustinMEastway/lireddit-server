import { Field, InputType } from 'type-graphql';

import { validateString } from '../../functions';
import { FormControlError } from '../../types';

@InputType()
export class UserLoginInput {
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