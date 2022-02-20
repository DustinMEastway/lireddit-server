import {
  minlengthValidator,
  requiredValidator
} from './form-validators';

export class Validators {
  public static readonly minlength = minlengthValidator;

  public static readonly required = requiredValidator;
}
