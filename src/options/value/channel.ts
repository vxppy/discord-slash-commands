import {
    ApplicationCommandOptionType,
    type APIApplicationCommandChannelOption,
    type ApplicationCommandOptionAllowedChannelType,
} from 'discord-api-types/v10';
import type { Channel } from 'discord.js';

import { BaseDefaultableValue } from '../base.js';
import type { RequiredOptionFields, DefaultValue } from '../../types/shared.js';

export class ChannelOption<
    TRequired extends boolean = false,
    THasDefault extends boolean = false,
> extends BaseDefaultableValue<
    ApplicationCommandOptionType.Channel,
    APIApplicationCommandChannelOption
> {
    declare private _r: TRequired;
    declare private _d: THasDefault;

    declare required: () => ChannelOption<true, THasDefault>;

    declare default: <TDefaultValue extends string>(
        value: TDefaultValue,
    ) => ChannelOption<TRequired, true>;

    constructor(data: RequiredOptionFields) {
        super({
            ...data,
        });
    }

    get Type(): ApplicationCommandOptionType.Channel {
        return ApplicationCommandOptionType.Channel;
    }

    get DefaultValue(): DefaultValue<Channel> {
        return this.defaultValue;
    }

    channelTypes(
        ...channelTypes: ApplicationCommandOptionAllowedChannelType[]
    ) {
        this.data.channel_types = channelTypes;
    }

    toJSON(): APIApplicationCommandChannelOption {
        return {
            type: ApplicationCommandOptionType.Channel,
            ...this.data,
        };
    }
}
