import { FormValidator } from './form-validator';

export interface FormControlValidation<T> {
  control?: {
    label: string;
    validators: FormValidator<T>[];
  };
}

export module FormControlValidation {
  export function isInstance<T = any>(
    validation: any
  ): validation is FormControlValidation<T> {
    if (!validation || typeof validation !== 'object') {
      return false;
    }

    const control = (validation as FormControlValidation<T> | null)?.control;

    return !control || (
      typeof control === 'object'
      && typeof control.label === 'string'
      && control.validators instanceof Array
      && control.validators.every((v): boolean => typeof v === 'function')
    );
  }
}
