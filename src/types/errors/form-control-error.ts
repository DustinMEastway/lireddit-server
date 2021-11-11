import { BaseError } from './base-error';

export type FormControlErrorMessages = string[];

export interface FormGroupErrorMessages {
  children?: Record<string, FormErrorMessages>;
  errors?: FormControlErrorMessages;
}

export interface FormArrayErrorMessages {
  children?: (FormErrorMessages | null)[];
  errors?: FormControlErrorMessages;
}

export type FormErrorMessages = FormControlErrorMessages | FormGroupErrorMessages | FormArrayErrorMessages;

export class FormControlError extends BaseError {
  readonly name = 'FormControlError';

  constructor(formErrors: FormErrorMessages, message?: string) {
    super(message ?? 'Invalid values provided', 'FORM_CONTROL_ERROR', 422, formErrors);
  }
}
