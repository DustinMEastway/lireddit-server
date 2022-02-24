import { Field, InputType } from 'type-graphql';
import { FormError } from '../../lib/backend/errors';
import { FormGroupErrorMessages } from '../../lib/forms';

import { validateString } from '../../functions';

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
      throw new FormError(errors);
    }
  }

  protected validateInner(): FormGroupErrorMessages<UserLoginInput> | null {
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