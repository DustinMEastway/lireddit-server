import { ApolloError } from 'apollo-server-express';

export class BaseError extends ApolloError {
  statusCode: number;

  constructor(
    message: string,
    code: string,
    httpStatusCode: number,
    extensions?: Record<string, any>
  ) {
    super(message, code, extensions);
    this.statusCode = httpStatusCode;
  }
}
