import {
    ApplicationCommandOptionType,
    type APIApplicationCommandBooleanOption,
} from 'discord-api-types/v10';

import { BaseDefaultableValue } from '../base.js';
import type { RequiredOptionFields, DefaultValue } from '../../types/shared.js';

export class BooleanOption<
    TRequired extends boolean = false,
    THasDefault extends boolean = false,
> extends BaseDefaultableValue<
    ApplicationCommandOptionType.Boolean,
    APIApplicationCommandBooleanOption
> {
    declare private _r: TRequired;
    declare private _d: THasDefault;

    declare required: () => BooleanOption<true, THasDefault>;

    declare default: <TDefaultValue extends boolean>(
        value: TDefaultValue,
    ) => BooleanOption<TRequired, true>;

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.Boolean {
        return ApplicationCommandOptionType.Boolean;
    }

    toJSON(): APIApplicationCommandBooleanOption {
        return {
            type: ApplicationCommandOptionType.Boolean,
            ...this.data,
        };
    }
}
