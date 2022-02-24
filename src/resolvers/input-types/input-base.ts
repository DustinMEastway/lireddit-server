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

    if (errors) {
      throw new FormError(errors);
    }
  }

  public getErrors(): FormGroupErrorMessages<this> | null {
    const validation = this.getValidation();
    if (validation == null) {
      return null;
    }

    return createValidator(validation as FormValidation<this>)(this) as FormGroupErrorMessages<this>;
  }

  protected getValidation(): FormGroupValidation<this> | null {
    return null;
  }
}
