import {
  emailValidator,
  maxlengthValidator,
  minlengthValidator,
  patternValidator,
  patternValidatorBase,
  patternsValidator,
  requiredValidator
} from './form-validators';

export class Validators {
  public static readonly email = emailValidator;
  public static readonly maxlength = maxlengthValidator;
  public static readonly minlength = minlengthValidator;
  public static readonly pattern = patternValidator;
  public static readonly patternBase = patternValidatorBase;
  public static readonly patterns = patternsValidator;
  public static readonly required = requiredValidator;
}
