import { Field, InputType, Int } from 'type-graphql';
import { extendValidation, ControlValidators, FormGroupValidation } from '../../lib/forms';

import { InputBase } from './input-base';

@InputType()
export class PostListInput extends InputBase {
  public static readonly defaultLimit = 25;
  @Field(() => String, { nullable: true })
  cursor: string | null;
  @Field(() => Int, { nullable: true })
  limit: number;

  protected getValidation<T = this>(): FormGroupValidation<T> | null;
  protected getValidation(): FormGroupValidation<PostListInput> | null {
    return extendValidation(super.getValidation(), {
      children: {
        limit: ControlValidators.number('Limit', {
          min: 1,
          max: 50
        })
      }
    });
  }
}