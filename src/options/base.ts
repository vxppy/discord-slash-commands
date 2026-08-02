import type {
    ApplicationCommandOptionAllowedChannelType,
    ApplicationCommandOptionType,
} from 'discord-api-types/v10';

import KawaiiValidationError from '../error.js';
import type {
    RequiredOptionFields,
    DefaultValue,
    LocalizationMap,
} from '../types/shared.js';

export interface ChoiceOption<T> {
    name: string;
    name_localizations?: LocalizationMap;

    value: T;
}

interface ApplicationCommandDataWithoutType {
    name: string;
    name_localizations?: LocalizationMap;

    description: string;
    description_localizations?: LocalizationMap;

    required?: boolean;

    min?: number;
    max?: number;

    min_length?: number;
    max_length?: number;

    autocomplete?: boolean;
    choices?: ChoiceOption<any>[];
    options?: ApplicationCommandData[];
    channel_types?: ApplicationCommandOptionAllowedChannelType[];
}

export type ApplicationCommandData = {
    type: ApplicationCommandOptionType;
} & ApplicationCommandDataWithoutType;

export abstract class BaseOption<
    TComponentType extends ApplicationCommandOptionType,
    TPayload,
> {
    declare _t: TComponentType;

    constructor(protected data: ApplicationCommandDataWithoutType) {}

    abstract get Type(): TComponentType;
    abstract toJSON(): TPayload;

    get Name() {
        return this.data.name;
    }

    get IsRequired() {
        return Boolean(this.data.required);
    }

    required(): any {
        this.data.required = true;
        return this;
    }

    nameLocalizations(localizations: LocalizationMap) {
        this.data.name_localizations = localizations;
    }

    descriptionLocalizations(localizations: LocalizationMap) {
        this.data.description_localizations = localizations;
    }
}

export abstract class BaseDefaultableValue<
    TComponentType extends ApplicationCommandOptionType,
    TPayload,
> extends BaseOption<TComponentType, TPayload> {
    protected defaultValue: DefaultValue<any> = undefined;

    get DefaultValue() {
        return this.defaultValue;
    }

    default(value: any): any {
        this.defaultValue = value;
        return this;
    }
}

export abstract class BaseChoiceOption<
    TComponentType extends ApplicationCommandOptionType,
    TPayload,
> extends BaseDefaultableValue<TComponentType, TPayload> {
    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Choices(): readonly any[] | undefined {
        return this.data.choices;
    }

    choices(...choices: ChoiceOption<any>[]): any {
        if (choices.length == 0) {
            throw new KawaiiValidationError(
                `Expected at least one choice in option '${this.data.name}'`,
                this.data.name,
            );
        }

        if (choices.length > 25) {
            throw new KawaiiValidationError(
                `Too many choices provided for option '${this.data.name}'. (Got: ${choices.length}, Max 25)`,
                this.data.name,
            );
        }

        this.data.choices = choices;
        return this;
    }

    autocomplete(autocomplete: boolean): any {
        this.data.autocomplete = autocomplete;
        return this;
    }
}
