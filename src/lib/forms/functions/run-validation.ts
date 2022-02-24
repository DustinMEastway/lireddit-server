import {
  FormArrayErrors,
  FormControlError,
  FormGroupErrors,
  FormErrors
} from '../errors';
import {
  FormArrayValidation,
  FormGroupValidation,
  FormValidation
} from '../validation';

export function runValidation<T>(validation: FormValidation<T>, value: T): FormErrors<T> {
  const errors: FormErrors<T> = {};

  if (validation.control) {
    errors.control = validation.control.validators?.map((validator): FormControlError | null =>
      validator(value)
    ).filter((error): boolean =>
      !!error
    ) as FormControlError[];
  }

  if (FormArrayValidation.isInstance(validation) && value instanceof Array) {
    (errors as FormArrayErrors<T>).children = validation.children?.map((childControl, childKey) => {
      return runValidation<T[keyof(T)]>(childControl, value[childKey]);
    });
  } else if (FormGroupValidation.isInstance(validation) && typeof value === 'object') {
    const childrenControls = (Object.entries(validation.children ?? {}) as [keyof(T), FormValidation<T[keyof(T)]>][]);
    (errors as FormGroupErrors<T>).children = childrenControls.reduce((
      childrenErrors,
      [childKey, childControl]
    ) => {
      childrenErrors![childKey] = runValidation(childControl, value[childKey]);
      return childrenErrors;
    }, {} as FormGroupErrors<T>['children'])
  }

  return errors;
}
