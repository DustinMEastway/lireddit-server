import { addControlError } from './add-control-error';
import { validateType } from './validate-type';

export interface ValidateStringConfig {
  maxLength?: number;
  minLength?: number;
  required?: boolean;
}

export function validateString(
  errors: Record<string, string[]>,
  controlKey: string,
  value: any,
  { maxLength, minLength, required }: ValidateStringConfig
): boolean {
  return (
    validateType(errors, controlKey, value, 'string')
    && [
      {
        message: () => `${controlKey} is required.`,
        validator: () => !required || !!value
      },
      {
        message: () => `${controlKey} must be at most ${maxLength} long`,
        validator: () => maxLength == null || !value || value.length <= maxLength
      },
      {
        message: () => `${controlKey} must be at least ${minLength} long`,
        validator: () => minLength == null || !value || value.length >= minLength
      }
    ].map(({ message, validator }) =>
      addControlError(errors, controlKey, message(), validator())
    ).every(v => v)
  );
}
