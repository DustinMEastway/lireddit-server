import { addControlError } from './add-control-error';

export function validateType(
  errors: Record<string, string[]>,
  controlKey: string,
  value: any,
  type: string
): boolean {
  return addControlError(
    errors,
    controlKey,
    `${controlKey} must be type '${type}'.`,
    typeof value === type
  );
}
