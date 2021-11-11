export function addControlError(
  errors: Record<string, string[]>,
  controlKey: string,
  error: string,
  isValid: boolean = false
): boolean {
  if (!isValid) {
    errors[controlKey] = (errors[controlKey] ?? []).concat(error);
  }

  return isValid;
}
