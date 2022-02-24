import {
  FormArrayErrorMessages,
  FormErrorMessages,
  FormGroupErrorMessages
} from '../error-messages';
import {
  FormArrayErrors,
  FormControlError,
  FormErrors,
  FormGroupErrors
} from '../errors';
import {
  FormArrayValidation,
  FormGroupValidation,
  FormValidation
} from '../validation';

export function requireErrorsProcessor<T>(
  validation: FormValidation<T>,
  errors: FormErrors<T>,
  errorProcessor: (control: FormValidation<any>, error: FormControlError) => string | null
): FormErrorMessages<T> {
  const errorMessages: FormErrorMessages<T> = {};

  if (errors.control) {
    errorMessages.control = errors.control.map((error): string => {
      const message = errorProcessor(validation, error);
      if (message == null) {
        throw new Error(`requireErrorsProcessor: missing message for error (${JSON.stringify(error)})`);
      }
      return message;
    });
  }

  if (FormArrayValidation.isInstance<unknown[]>(validation) && FormArrayErrors.isInstance(errors)) {
    (errorMessages as FormArrayErrorMessages<T>).children = errors.children?.map((childErrors, childKey) => {
      return requireErrorsProcessor<T[keyof(T)]>(validation.children![childKey], childErrors, errorProcessor);
    });
  } else if (FormGroupValidation.isInstance<T>(validation) && FormGroupErrors.isInstance(errors)) {
    const childrenErrors = Object.entries(errors.children ?? {}) as [keyof(T), FormErrors<T[keyof(T)]>][]
    (errorMessages as FormGroupErrorMessages<T>).children = childrenErrors.reduce((childrenMessages, [childKey, childErrors]) => {
      childrenMessages![childKey] = requireErrorsProcessor<T[keyof(T)]>(validation.children![childKey]!, childErrors, errorProcessor);
      return childrenMessages;
    }, {} as FormGroupErrorMessages<T>['children']);
  }

  return errorMessages;
}
