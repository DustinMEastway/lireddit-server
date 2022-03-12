import { FormControlError } from '../errors';
import { FormValidation } from '../validation';
import { Validators } from '../validators';
import {
  MaxlengthError,
  MinlengthError,
  PatternError
} from '../validators/errors';

export function defaultErrorProcessor(
  validation: FormValidation<any>,
  [errorCode, errorValue]: FormControlError
): string | null {
  const label = validation.control!.label;
  switch (errorCode) {
    case Validators.email.key:
      return `${label} must be a valid email.`;
    case Validators.maxlength.key:
      return `${label} must have a maximum length of ${(errorValue as MaxlengthError).maxlength}.`;
    case Validators.minlength.key:
      return `${label} must have a minimum length of ${(errorValue as MinlengthError).minlength}.`;
    case Validators.pattern.key:
      return `${label} must satisfy pattern '${(errorValue as PatternError).pattern}'.`;
    case Validators.patterns.key:
      return `${label} must satisfy patterns.`;
    case Validators.required.key:
      return `${label} is required.`;
  }

  return null;
}
