import { FormArrayValidation } from './form-array-validation';
import { FormControlValidation } from './form-control-validation';
import { FormValidation } from './form-validation';

export interface FormGroupValidation<T extends Object> extends FormControlValidation<T> {
  children?: {
    [K in keyof(T)]?: FormValidation<T[K]>;
  };
}

export module FormGroupValidation {
  export function isInstance<T>(validation: any): validation is FormGroupValidation<T> {
    if (!FormControlValidation.isInstance(validation)) {
      return false;
    }

    const children = (validation as FormArrayValidation<any> | FormGroupValidation<T> | null)?.children;

    return (
      typeof children === 'object'
      && !(children instanceof Array)
      && Object.values(children).every((c): boolean => FormControlValidation.isInstance(c))
    );
  }
}
