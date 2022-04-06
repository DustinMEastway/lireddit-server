import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from '../lib/backend/errors';

import { AppContext } from '../types';

export const isAuthenticated: MiddlewareFn<AppContext> = ({ context }, next) => {
  if (!context.request.session.userId) {
    throw new AuthenticationError();
  }

  return next();
};
