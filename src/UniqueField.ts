import {registerDecorator, ValidationOptions, ValidatorConstraint,
    ValidatorConstraintInterface, ValidationArguments} from "class-validator";

import {getRepository} from "typeorm";

@ValidatorConstraint({ async: true })
export class UniqueField implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        let obj = {};
        let entity = args[0];
        obj[args[1]] = value;
        return getRepository(entity).findOne(obj).then(entity => {
            return !entity;
        });
    }

    defaultMessage(args: ValidationArguments) {
        return "Duplicate " + args[1];
    }

}

export function IsUsernameAlreadyExist(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: UniqueField
        });
    };
}