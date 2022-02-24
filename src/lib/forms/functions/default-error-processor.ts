import { FormControlError } from '../errors';
import { FormValidation } from '../validation';
import { Validators } from '../validators';
import { MinlengthError } from '../validators/errors';

export function defaultErrorProcessor(
  validation: FormValidation<any>,
  [errorCode, errorValue]: FormControlError
): string | null {
  const label = validation.control!.label;
  switch (errorCode) {
    case Validators.minlength.key:
      return `${label} must have a minimum length of ${(errorValue as MinlengthError).minlength}.`;
    case Validators.required.key:
      return `${label} is required.`;
  }

  return null;
}
