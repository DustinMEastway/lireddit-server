import { Field, InputType, Int } from 'type-graphql';
import { extendValidation, ControlValidators, FormGroupValidation } from '../../lib/forms';

import { InputBase } from './input-base';

@InputType()
export class PostInput extends InputBase {
  @Field(() => Int)
  id: number;

  protected getValidation<T = this>(): FormGroupValidation<T> | null;
  protected getValidation(): FormGroupValidation<PostInput> | null {
    return extendValidation(super.getValidation(), {
      children: {
        id: ControlValidators.number('id', {
          min: 1,
          required: true
        })
      }
    });
  }
}