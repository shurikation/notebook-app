export class Validator {
  static validate(value = '') {
    return value && value.trim();
  }
}