import {
    ApplicationCommandOptionType,
    type APIApplicationCommandStringOption,
} from 'discord-api-types/v10';

import { BaseChoiceOption, type ChoiceOption } from '../base.js';
import type {
    RequiredOptionFields,
    DefaultValue,
    OptionMode,
} from '../../types/shared.js';

export class StringOption<
    TValue = string,
    TRequired extends boolean = false,
    TOptionMode extends OptionMode = 'root',
    THasDefault extends boolean = false,
> extends BaseChoiceOption<
    ApplicationCommandOptionType.String,
    APIApplicationCommandStringOption
> {
    declare private _c: TValue;
    declare private _r: TRequired;
    declare private _m: TOptionMode;
    declare private _d: THasDefault;

    declare required: () => StringOption<
        TValue,
        true,
        TOptionMode,
        THasDefault
    >;

    declare choices: <const Choices extends readonly ChoiceOption<string>[]>(
        this: StringOption<TValue, TRequired, 'root'>,
        ...choices: Choices
    ) => StringOption<
        Choices[number]['value'],
        TRequired,
        'choice',
        THasDefault
    >;

    declare autocomplete: (
        autocomplete: boolean,
    ) => StringOption<TValue, TRequired, TOptionMode, THasDefault>;

    declare default: <TDefaultValue extends TValue>(
        value: TDefaultValue,
    ) => StringOption<TValue, TRequired, TOptionMode, true>;

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.String {
        return ApplicationCommandOptionType.String;
    }

    get DefaultValue(): DefaultValue<TValue> {
        return this.defaultValue;
    }

    minLength(
        this: StringOption<TValue, TRequired, 'root' | 'raw'>,
        length: number,
    ) {
        this.data.min_length = length;
        return this as StringOption<TValue, TRequired, 'raw', THasDefault>;
    }

    maxLength(
        this: StringOption<TValue, TRequired, 'root' | 'raw', THasDefault>,
        length: number,
    ) {
        this.data.max_length = length;
        return this as StringOption<TValue, TRequired, 'raw', THasDefault>;
    }

    toJSON(): APIApplicationCommandStringOption {
        if (this.data.choices) {
            return {
                ...this.data,
                type: ApplicationCommandOptionType.String,
                autocomplete: false,
            };
        }

        return {
            ...this.data,
            type: ApplicationCommandOptionType.String,
            choices: this.data.choices as never,
            autocomplete: Boolean(this.data.autocomplete),
        };
    }
}
