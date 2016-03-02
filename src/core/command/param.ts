import {
    Command,
    GeneralValidator
} from './command';

import {
    Reflection
} from '../../utils';

export interface ParamOptions<T> {
    type?: Clime.Constructor<T>;
    description?: string;
    required?: boolean;
    validator?: GeneralValidator<T>;
    validators?: GeneralValidator<T>[];
    default?: T;
}

export interface ParamDefinition<T> {
    name: string;
    index: number;
    type: Clime.Constructor<T>;
    description: string;
    required: boolean;
    validators: GeneralValidator<T>[];
    default: T;
}

export function param<T>(
    {
        type,
        required,
        validator,
        validators,
        default: defaultValue,
        description
    }: ParamOptions<T> = {}
) {
    if (!validators) {
        validators = validator ? [validator] : [];
    }

    return (target: Command, name: 'execute', index: number) => {
        let constructor = target.constructor as typeof Command;

        let definitions = constructor.paramDefinitions;

        if (constructor.paramDefinitions) {
            definitions = constructor.paramDefinitions;
        } else {
            definitions = constructor.paramDefinitions = [];
        }

        type = type ||
            Reflect.getMetadata('design:paramtypes', target, 'execute')[index] as Clime.Constructor<T>;

        definitions[index] = {
            name: Reflection.getFunctionParameterName(target.execute, index),
            index,
            type,
            required,
            validators,
            default: defaultValue,
            description
        };
    };
}
