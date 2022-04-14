import { Keyed } from '../../../core';
import { MaxError } from '../errors';
import { FormValidator } from '../form-validator';
import { requiredValidator } from './required';

export const maxValidator: ((max: number) => FormValidator<number>) & Keyed = (max: number) => {
  return (value): [string, MaxError] | null => {
    return (requiredValidator(value) || value.length <= max)
      ? null
      : [maxValidator.key, { max, value }];
  };
};

maxValidator.key = 'max';
