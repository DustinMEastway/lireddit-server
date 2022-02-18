import { FormControlErrorMessages } from './form-control-error-messages';
import { FormErrorMessages } from './form-error-messages';

export interface FormGroupErrorMessages<T> extends FormControlErrorMessages {
  children?: {
    [K in keyof(T)]?: FormErrorMessages<T[K]>;
  };
}
