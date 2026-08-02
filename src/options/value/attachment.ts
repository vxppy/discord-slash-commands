import {
    ApplicationCommandOptionType,
    type APIApplicationCommandAttachmentOption,
} from 'discord-api-types/v10';

import type { RequiredOptionFields } from '../../types/shared.js';
import { BaseOption } from '../base.js';

export class AttachmentOption<
    TRequired extends boolean = false,
> extends BaseOption<
    ApplicationCommandOptionType.Attachment,
    APIApplicationCommandAttachmentOption
> {
    declare private _r: TRequired;

    declare required: () => AttachmentOption<true>;

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.Attachment {
        return ApplicationCommandOptionType.Attachment;
    }

    toJSON(): APIApplicationCommandAttachmentOption {
        return {
            type: ApplicationCommandOptionType.Attachment,
            ...this.data,
        };
    }
}
