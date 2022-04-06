import { BaseError } from './base-error';

export class AuthenticationError extends BaseError {
  readonly name = 'AuthenticationError';

  constructor(message?: string) {
    super(message ?? 'Not Authenticated.', 'AUTHENTICATION_ERROR', 403);
  }
}
