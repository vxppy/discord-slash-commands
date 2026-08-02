import {
    ApplicationCommandOptionType,
    type APIApplicationCommandRoleOption,
} from 'discord-api-types/v10';
import type { Role } from 'discord.js';

import { BaseDefaultableValue } from '../base.js';
import type { RequiredOptionFields, DefaultValue } from '../../types/shared.js';

export class RoleOption<
    TRequired extends boolean = false,
    THasDefault extends boolean = false,
> extends BaseDefaultableValue<
    ApplicationCommandOptionType.Role,
    APIApplicationCommandRoleOption
> {
    declare private _r: TRequired;
    declare private _d: THasDefault;

    declare required: () => RoleOption<true, THasDefault>;

    declare default: <TDefaultValue extends string>(
        value: TDefaultValue,
    ) => RoleOption<TRequired, true>;

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.Role {
        return ApplicationCommandOptionType.Role;
    }

    get DefaultValue(): DefaultValue<Role> {
        return this.defaultValue;
    }

    toJSON(): APIApplicationCommandRoleOption {
        return {
            type: ApplicationCommandOptionType.Role,
            ...this.data,
        };
    }
}
