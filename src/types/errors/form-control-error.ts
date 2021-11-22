import { BaseError } from './base-error';

export type FormControlErrorMessages = string[];

export interface FormGroupErrorMessages {
  children?: Record<string, FormControlErrorMessages>;
  errors?: FormControlErrorMessages;
}

export interface FormArrayErrorMessages {
  children?: (FormControlErrorMessages | null)[];
  errors?: FormControlErrorMessages;
}

export type FormErrorMessages = FormControlErrorMessages | FormGroupErrorMessages | FormArrayErrorMessages;

export class FormControlError extends BaseError {
  readonly name = 'FormControlError';

  constructor(formErrors: FormGroupErrorMessages, message?: string) {
    super(message ?? 'Invalid values provided', 'FORM_CONTROL_ERROR', 422, { formControlError: formErrors });
  }
}
