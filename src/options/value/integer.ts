import {
    ApplicationCommandOptionType,
    type APIApplicationCommandIntegerOption,
} from 'discord-api-types/v10';

import { BaseChoiceOption, type ChoiceOption } from '../base.js';
import type {
    RequiredOptionFields,
    DefaultValue,
    OptionMode,
} from '../../types/shared.js';
import { underline } from 'discord.js';

export class IntegerOption<
    TValue = number,
    TRequired extends boolean = false,
    TOptionMode extends OptionMode = 'root',
    THasDefault extends boolean = false,
> extends BaseChoiceOption<
    ApplicationCommandOptionType.Integer,
    APIApplicationCommandIntegerOption
> {
    declare private _c: TValue;
    declare private _r: TRequired;
    declare private _m: TOptionMode;
    declare private _d: THasDefault;

    declare required: () => IntegerOption<
        TValue,
        true,
        TOptionMode,
        THasDefault
    >;

    declare choices: <const Choices extends readonly ChoiceOption<number>[]>(
        this: IntegerOption<TValue, TRequired, 'root'>,
        ...choices: Choices
    ) => IntegerOption<
        Choices[number]['value'],
        TRequired,
        'choice',
        THasDefault
    >;

    declare default: <TDefaultValue extends TValue>(
        value: TDefaultValue,
    ) => IntegerOption<TValue, TRequired, TOptionMode, true>;

    declare autocomplete: (
        autocomplete: boolean,
    ) => IntegerOption<TValue, TRequired, TOptionMode, THasDefault>;

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.Integer {
        return ApplicationCommandOptionType.Integer;
    }

    get DefaultValue(): DefaultValue<TValue> {
        return this.defaultValue;
    }

    min(
        this: IntegerOption<TValue, TRequired, 'root' | 'raw', THasDefault>,
        length: number,
    ) {
        this.data.min = length;
        return this as IntegerOption<TValue, TRequired, 'raw', THasDefault>;
    }

    max(
        this: IntegerOption<TValue, TRequired, 'root' | 'raw', THasDefault>,
        length: number,
    ) {
        this.data.max = length;
        return this as IntegerOption<TValue, TRequired, 'raw', THasDefault>;
    }

    toJSON(): APIApplicationCommandIntegerOption {
        if (this.data.choices) {
            return {
                ...this.data,
                type: ApplicationCommandOptionType.Integer,
                autocomplete: false,
            };
        }

        return {
            ...this.data,
            type: ApplicationCommandOptionType.Integer,
            choices: this.data.choices as never,
            autocomplete: Boolean(this.data.autocomplete),
        };
    }
}
