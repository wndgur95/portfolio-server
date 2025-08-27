import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ConstantsValidator', async: true })
export class ConstantsValidator implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    return this.check(value, validationArguments.constraints);
  }

  check(value: string, constraints: unknown): boolean {
    if (Array.isArray(constraints)) {
      return constraints.some((c) => this.check(value, c));
    }
    if (typeof constraints === 'object') {
      return Object.values(constraints).some((c) => this.check(value, c));
    }
    return value === constraints;
  }
}
