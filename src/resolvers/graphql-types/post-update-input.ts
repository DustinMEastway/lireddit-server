import { Field, InputType, Int } from 'type-graphql';
import { extendValidation, ControlValidators, FormGroupValidation } from '../../lib/forms';

import { InputBase } from './input-base';

@InputType()
export class PostUpdateInput extends InputBase {
  @Field(() => Int)
  id: number;
  @Field()
  text: string;
  @Field()
  title: string;

  protected getValidation<T = this>(): FormGroupValidation<T> | null;
  protected getValidation(): FormGroupValidation<PostUpdateInput> | null {
    return extendValidation(super.getValidation(), {
      children: {
        id: ControlValidators.number('id', {
          min: 1,
          required: true
        }),
        text: ControlValidators.string('Text', {
          required: true
        }),
        title: ControlValidators.string('Title', {
          required: true
        })
      }
    });
  }
}
