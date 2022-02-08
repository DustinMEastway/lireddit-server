import { Field, InputType } from 'type-graphql';

import { validateString } from '../../functions';
import { FormControlError, FormGroupErrorMessages } from '../../types';

@InputType()
export class UserLoginInput {
  @Field()
  password: string;
  @Field()
  username: string;

  validate(): void {
    this.password = this.password.trim();
    this.username = this.username.trim();
    const errors = this.validateInner();

    if (errors) {
      throw new FormControlError(errors);
    }
  }

  protected validateInner(): FormGroupErrorMessages | null {
    const errors: Record<string, string[]> = {};

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
      return { children: errors };
    }

    return null;
  }
}