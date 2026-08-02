import {
    ApplicationCommandOptionType,
    type APIApplicationCommandMentionableOption,
} from 'discord-api-types/v10';
import type { GuildMember, Role, User } from 'discord.js';

import { BaseDefaultableValue } from '../base.js';
import type {
    RequiredOptionFields,
    DefaultValue,
    XOR,
} from '../../types/shared.js';

export class MentionableOption<
    TRequired extends boolean = false,
    THasDefault extends boolean = false,
> extends BaseDefaultableValue<
    ApplicationCommandOptionType.Mentionable,
    APIApplicationCommandMentionableOption
> {
    declare private _r: TRequired;
    declare private _d: THasDefault;

    declare required: () => MentionableOption<true, THasDefault>;

    declare default: <
        TDefaultValue extends XOR<{ user: string }, { role: string }>,
    >(
        value: TDefaultValue,
    ) => MentionableOption<TRequired, true>;

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.Mentionable {
        return ApplicationCommandOptionType.Mentionable;
    }

    get DefaultValue(): DefaultValue<{
        user?: User;
        member?: GuildMember;
        role?: Role;
    }> {
        return this.defaultValue;
    }

    toJSON(): APIApplicationCommandMentionableOption {
        return {
            type: ApplicationCommandOptionType.Mentionable,
            ...this.data,
        };
    }
}
