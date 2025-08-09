// src/types.ts
//export type FieldType = 'text'|'number'|'textarea'|'select'|'radio'|'checkbox'|'date';
export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'email' | 'password';


export interface PasswordRule {
  minLength?: number;
  requireNumber?: boolean;
  requireSpecial?: boolean;
}

export interface ValidationRules {
  notEmpty?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: PasswordRule | null;
}

export interface DerivedConfig {
  parentKeys: string[]; // keys of parent fields
  expression: string;   // JS expression referencing parent keys, e.g. "Math.floor((Date.now() - new Date(dob))/...)" or "parseInt(a) + parseInt(b)"
}

export interface FieldSchema {
  id: string;        // uuid
  key: string;       // unique input name (e.g., field_1 or user_dob)
  type: FieldType;
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: string[]; // for select, radio, checkbox
  validations?: ValidationRules | null;
  derived?: DerivedConfig | null;
}

export interface FormSchema {
  id: string;
  name?: string;
  createdAt?: string;
  fields: FieldSchema[];
}