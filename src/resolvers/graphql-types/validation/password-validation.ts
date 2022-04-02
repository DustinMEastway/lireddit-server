import { ControlValidators } from '../../../lib/forms';

export const passwordValidation = ControlValidators.string('Password', {
  maxlength: 100,
  minlength: 3,
  required: true
});
