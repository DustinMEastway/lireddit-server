import { Field, InputType } from 'type-graphql';
import { extendValidation, ControlValidators, FormGroupValidation } from '../../lib/forms';

import { InputBase } from './input-base';

@InputType()
export class PostCreateInput extends InputBase {
  @Field()
  text: string;
  @Field()
  title: string;

  protected getValidation<T = this>(): FormGroupValidation<T> | null;
  protected getValidation(): FormGroupValidation<PostCreateInput> | null {
    return extendValidation(super.getValidation(), {
      children: {
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