import { Field, InputType } from 'type-graphql';
import { extendValidation, ControlValidators, FormGroupValidation } from '../../lib/forms';

import { InputBase } from './input-base';
import { passwordValidation } from './validation';

@InputType()
export class UserChangePasswordInput extends InputBase {
  @Field()
  password: string;
  @Field()
  token: string;

  protected getValidation<T = this>(): FormGroupValidation<T> | null;
  protected getValidation(): FormGroupValidation<UserChangePasswordInput> | null {
    return extendValidation(super.getValidation(), {
      children: {
        password: passwordValidation,
        token: ControlValidators.string('token', {
          required: true
        })
      }
    });
  }
}