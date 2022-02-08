import { Field, InputType } from 'type-graphql';

import { validateString } from '../../functions';
import { FormGroupErrorMessages } from '../../types';
import { UserLoginInput } from './user-login-input';

@InputType()
export class UserCreateInput extends UserLoginInput {
  @Field()
  email: string;

  protected validateInner(): FormGroupErrorMessages | null {
    this.email = this.email.trim();

    const baseValidation = super.validateInner();
    const errors: Record<string, string[]> = {};
    if ([
      validateString(errors, 'email', this.email, {
        patterns: {
          email: /.+@.+\..+/
        },
        required: true
      }),
      validateString(errors, 'username', this.username, {
        patterns: {
          username: /^[^@]+$/
        }
      })
    ].some(v => !v)) {
      return {
        errors: baseValidation?.errors,
        children: {
          ...baseValidation?.children,
          ...errors
        }
      };
    }

    return baseValidation;
  }
}