import { FormControlErrorMessages } from './form-control-error-messages';
import { FormErrorMessages } from './form-error-messages';

export interface FormArrayErrorMessages<T> extends FormControlErrorMessages {
  children?: FormErrorMessages<T[keyof(T)]>[];
}
