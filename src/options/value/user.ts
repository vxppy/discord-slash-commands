import {
    ApplicationCommandOptionType,
    type APIApplicationCommandUserOption,
} from 'discord-api-types/v10';
import type { User, GuildMember } from 'discord.js';

import { BaseDefaultableValue } from '../base.js';
import type { RequiredOptionFields, DefaultValue } from '../../types/shared.js';

export class UserOption<
    TRequired extends boolean = false,
    THasDefault extends boolean = false,
> extends BaseDefaultableValue<
    ApplicationCommandOptionType.User,
    APIApplicationCommandUserOption
> {
    declare private _r: TRequired;
    declare private _d: THasDefault;

    declare required: () => UserOption<true, THasDefault>;

    declare default: <TDefaultValue extends string>(
        value: TDefaultValue,
    ) => UserOption<TRequired, true>;

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.User {
        return ApplicationCommandOptionType.User;
    }

    get DefaultValue(): DefaultValue<{ user: User; member?: GuildMember }> {
        return this.defaultValue;
    }

    toJSON(): APIApplicationCommandUserOption {
        return {
            type: ApplicationCommandOptionType.User,
            ...this.data,
        };
    }
}
