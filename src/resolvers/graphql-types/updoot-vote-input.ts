import { Field, InputType } from 'type-graphql';
import { extendValidation, ControlValidators, FormGroupValidation } from '../../lib/forms';

import { InputBase } from './input-base';

@InputType()
export class UpdootVoteInput extends InputBase {
  @Field()
  postId: number;
  @Field()
  vote: -1 | 0 | 1;

  protected getValidation<T = this>(): FormGroupValidation<T> | null;
  protected getValidation(): FormGroupValidation<UpdootVoteInput> | null {
    return extendValidation(super.getValidation(), {
      children: {
        vote: ControlValidators.number('Vote', {
          required: true,
          max: 1,
          min: -1
        })
      }
    });
  }
}
