import { Field, InputType } from 'type-graphql';
import { extendValidation, ControlValidators, FormGroupValidation } from '../../lib/forms';

import { InputBase } from './input-base';

@InputType()
export class UserLoginInput extends InputBase {
  @Field()
  password: string;
  @Field()
  username: string;

  protected getValidation<T = this>(): FormGroupValidation<T> | null;
  protected getValidation(): FormGroupValidation<UserLoginInput> | null {
    return extendValidation(super.getValidation(), {
      children: {
        password: ControlValidators.string('Password', {
          maxlength: 100,
          minlength: 3,
          required: true
        }),
        username: ControlValidators.string('Username', {
          maxlength: 30,
          minlength: 3,
          required: true
        })
      }
    });
  }
}