import {
    ApplicationCommandOptionType,
    type APIApplicationCommandSubcommandGroupOption,
} from 'discord-api-types/v10';

import type {
    RequiredOptionFields,
    MakeOption,
    NamedOption,
    Simplify,
} from '../../types/shared.js';
import { BaseOption } from '../base.js';
import { SubCommand } from './subcommand.js';

export class SubCommandGroup<TArgs extends {} = {}> extends BaseOption<
    ApplicationCommandOptionType.SubcommandGroup,
    APIApplicationCommandSubcommandGroupOption
> {
    private options: SubCommand<any, any>[] = [];

    constructor(data: RequiredOptionFields) {
        super(data);
    }

    get Type(): ApplicationCommandOptionType.SubcommandGroup {
        return ApplicationCommandOptionType.SubcommandGroup;
    }

    get Options(): readonly SubCommand<any, any>[] {
        return [...this.options];
    }

    addSubCommand<TName extends string, TShape extends {}>(
        data: NamedOption<TName>,
        transform?: (option: SubCommand<{}, any>) => SubCommand<TShape, any>,
    ) {
        const baseOption = new SubCommand<{}, true>(data);

        this.options.push(transform ? transform(baseOption) : baseOption);

        return this as SubCommandGroup<
            Simplify<TArgs & MakeOption<TName, TShape, true, false>>
        >;
    }

    toJSON(): APIApplicationCommandSubcommandGroupOption {
        return {
            ...this.data,
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: this.options.map((i) => i.toJSON()),
        };
    }
}
