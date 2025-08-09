// src/utils/validation.ts
/*import type { ValidationRules } from '../types';

export function buildRHFRules(validations?: ValidationRules) {
  const rules: any = {};
  if (!validations) return rules;
  if (validations.notEmpty) rules.required = 'This field is required';
  if (validations.minLength) rules.minLength = { value: validations.minLength, message: `Minimum ${validations.minLength} characters` };
  if (validations.maxLength) rules.maxLength = { value: validations.maxLength, message: `Maximum ${validations.maxLength} characters` };
  if (validations.email) rules.pattern = { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' };
  if (validations.passwordRule) {
    const vr = validations.passwordRule;
    if (vr.minLength) rules.minLength = { value: vr.minLength, message: `Minimum ${vr.minLength} chars` };
    if (vr.requireNumber) rules.pattern = { value: /\d/, message: 'Must contain a number' };
    if (vr.requireSpecial) rules.pattern = { value: /[!@#\$%\^&\*]/, message: 'Must contain a special char' };
  }
  return rules;
} */

  import type { ValidationRules } from '../types';

export function buildRHFRules(validations?: ValidationRules) {
  const rules: any = {};
  if (!validations) return rules;

  if (validations.notEmpty) {
    rules.required = 'This field is required';
  }

  // min length (choose the largest one between normal + password rule)
  const minLengths = [
    validations.minLength ?? 0,
    validations.passwordRule?.minLength ?? 0
  ].filter(Boolean);
  if (minLengths.length) {
    rules.minLength = {
      value: Math.max(...minLengths),
      message: `Minimum ${Math.max(...minLengths)} characters`
    };
  }

  // max length
  if (validations.maxLength) {
    rules.maxLength = {
      value: validations.maxLength,
      message: `Maximum ${validations.maxLength} characters`
    };
  }

  // Combine multiple patterns into one validator
  const patternChecks: { regex: RegExp; message: string }[] = [];

  if (validations.email) {
    patternChecks.push({ regex: /^\S+@\S+\.\S+$/, message: 'Invalid email format' });
  }
  if (validations.passwordRule?.requireNumber) {
    patternChecks.push({ regex: /\d/, message: 'Must contain a number' });
  }
  if (validations.passwordRule?.requireSpecial) {
    patternChecks.push({
      regex: /[!@#\$%\^&\*]/,
      message: 'Must contain a special character'
    });
  }

  if (patternChecks.length) {
    rules.validate = (value: string) => {
      for (const check of patternChecks) {
        if (!check.regex.test(value)) return check.message;
      }
      return true;
    };
  }

  return rules;
}
