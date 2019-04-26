import {registerDecorator, ValidationOptions, ValidatorConstraint,
    ValidatorConstraintInterface, ValidationArguments} from "class-validator";

import {getRepository} from "typeorm";

@ValidatorConstraint({ async: true })
export class UniqueField implements ValidatorConstraintInterface {

    validate(value: any, args: ValidationArguments) {
        let obj = {};
        obj[args.constraints[1]] = value;
        return getRepository(args.constraints[0]).findOne(obj).then(entity => !entity);
    }

    defaultMessage(args: ValidationArguments) {
        return "Duplicate " + args.constraints[1];
    }

}