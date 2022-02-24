import { Field, InputType } from 'type-graphql';
import { FormGroupErrorMessages } from '../../lib/forms';

import { validateString } from '../../functions';
import { UserLoginInput } from './user-login-input';

@InputType()
export class UserCreateInput extends UserLoginInput {
  @Field()
  email: string;

  protected validateInner(): FormGroupErrorMessages<UserCreateInput> | null {
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
        control: baseValidation?.control,
        children: {
          ...baseValidation?.children,
          ...errors
        }
      };
    }

    return baseValidation;
  }
}