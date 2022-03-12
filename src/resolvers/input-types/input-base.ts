import {
  createValidator,
  FormGroupErrorMessages,
  FormGroupValidation,
  FormValidation
} from '../../lib/forms';
import { FormError } from '../../lib/backend/errors';

export abstract class InputBase {
  public throwIfInvalid(): void {
    const errors = this.getErrors();

    if (errors != null) {
      throw new FormError(errors);
    }
  }

  public getErrors(): FormGroupErrorMessages<this> | null {
    const validation = this.getValidation<this>();
    if (validation == null) {
      return null;
    }

    return createValidator(validation as FormValidation<this>)(this) as FormGroupErrorMessages<this>;
  }

  protected getValidation<T = this>(): FormGroupValidation<T> | null {
    return null;
  }
}
