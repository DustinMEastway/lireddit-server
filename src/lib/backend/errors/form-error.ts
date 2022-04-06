import { BaseError } from './base-error';
import { FormErrorMessages } from '../../forms';

export class FormError extends BaseError {
  readonly name = 'FormError';

  constructor(formErrors: FormErrorMessages<any>, message?: string) {
    super(message ?? 'Invalid values provided.', 'FORM_CONTROL_ERROR', 422, { formControlError: formErrors });
  }
}
