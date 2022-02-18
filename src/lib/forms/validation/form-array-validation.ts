import { FormControlValidation } from './form-control-validation';
import { FormGroupValidation } from './form-group-validation';
import { FormValidation } from './form-validation';

export interface FormArrayValidation<T extends any[]> extends FormControlValidation<T> {
  children?: FormValidation<T[keyof(T)]>[];
}

export module FormArrayValidation {
  export function isInstance<T extends any[] = unknown[]>(
    validation: any
  ): validation is FormArrayValidation<T> {
    if (!FormControlValidation.isInstance(validation)) {
      return false;
    }

    const children = (validation as FormArrayValidation<T> | FormGroupValidation<any> | null)?.children;

    return (
      children instanceof Array
      && children.every((c): boolean => FormControlValidation.isInstance(c))
    );
  }
}
