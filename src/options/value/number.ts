import {
    ApplicationCommandOptionType,
    type APIApplicationCommandNumberOption,
} from 'discord-api-types/v10';

import { BaseChoiceOption, type ChoiceOption } from '../base.js';
import type {
    RequiredOptionFields,
    DefaultValue,
    OptionMode,
} from '../../types/shared.js';

export class NumberOption<
    TValue = number,
    TRequired extends boolean = false,
    TOptionMode extends OptionMode = 'root',
    THasDefault extends boolean = false,
> extends BaseChoiceOption<
    ApplicationCommandOptionType.Number,
    APIApplicationCommandNumberOption
> {
    declare private _c: TValue;
    declare private _r: TRequired;
    declare private _m: TOptionMode;
    declare private _d: THasDefault;

    declare required: () => NumberOption<
        TValue,
        true,
        TOptionMode,
        THasDefault
    >;

    declare choices: <const Choices extends readonly ChoiceOption<number>[]>(
        this: NumberOption<TValue, TRequired, 'root'>,
        ...choices: Choices
    ) => NumberOption<
        Choices[number]['value'],
        TRequired,
        'choice',
        THasDefault
    >;

    declare default: <TDefaultValue extends TValue>(
        value: TDefaultValue,
    ) => NumberOption<TValue, TRequired, TOptionMode, true>;

    declare autocomplete: (
        autocomplete: boolean,
    ) => NumberOption<TValue, TRequired, TOptionMode, THasDefault>;

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.Number {
        return ApplicationCommandOptionType.Number;
    }

    get DefaultValue(): DefaultValue<TValue> {
        return this.defaultValue;
    }

    min(this: NumberOption<TValue, TRequired, 'root' | 'raw'>, length: number) {
        this.data.min = length;
        return this as NumberOption<TValue, TRequired, 'raw', THasDefault>;
    }

    max(this: NumberOption<TValue, TRequired, 'root' | 'raw'>, length: number) {
        this.data.max = length;
        return this as NumberOption<TValue, TRequired, 'raw', THasDefault>;
    }

    toJSON(): APIApplicationCommandNumberOption {
        if (this.data.choices) {
            return {
                ...this.data,
                type: ApplicationCommandOptionType.Number,
                autocomplete: false,
            };
        }

        return {
            ...this.data,
            type: ApplicationCommandOptionType.Number,
            choices: this.data.choices as never,
            autocomplete: Boolean(this.data.autocomplete),
        };
    }
}
