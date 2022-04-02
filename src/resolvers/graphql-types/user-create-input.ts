import { Field, InputType } from 'type-graphql';
import { extendValidation, ControlValidators, FormGroupValidation } from '../../lib/forms';

import { UserLoginInput } from './user-login-input';

@InputType()
export class UserCreateInput extends UserLoginInput {
  @Field()
  email: string;

  protected getValidation<T = this>(): FormGroupValidation<T> | null;
  protected getValidation(): FormGroupValidation<UserCreateInput> | null {
    return extendValidation(super.getValidation(), {
      children: {
        email: ControlValidators.string('Email', {
          email: true,
          maxlength: 100,
          required: true
        }),
        username: ControlValidators.string('Username', {
          pattern: /^[^@]*$/
        })
      }
    });
  }
}