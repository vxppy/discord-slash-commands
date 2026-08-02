import {
    ApplicationCommandOptionType,
    type APIApplicationCommandSubcommandOption,
} from 'discord-api-types/v10';
import type { Attachment, Channel, GuildMember, Role, User } from 'discord.js';

import KawaiiValidationError from '../../error.js';
import type {
    MakeOption,
    NamedOption,
    OptionMode,
    RequiredOptionFields,
    Simplify,
} from '../../types/shared.js';
import { BaseOption } from '../base.js';
import {
    AttachmentOption,
    BooleanOption,
    IntegerOption,
    ChannelOption,
    MentionableOption,
    NumberOption,
    RoleOption,
    StringOption,
    UserOption,
} from '../value/index.js';

type SubCommandChildOption =
    | StringOption<any, any, any, any>
    | IntegerOption<any, any, any, any>
    | BooleanOption<any, any>
    | UserOption<any, any>
    | ChannelOption<any, any>
    | RoleOption<any, any>
    | MentionableOption<any, any>
    | NumberOption<any, any, any, any>
    | AttachmentOption<any>;

export class SubCommand<
    TArgs extends {} = {},
    TCanHaveRequired extends boolean = true,
> extends BaseOption<
    ApplicationCommandOptionType.Subcommand,
    APIApplicationCommandSubcommandOption
> {
    declare required: never;
    private canPushRequired = true;

    private options: SubCommandChildOption[] = [];

    constructor(data: RequiredOptionFields) {
        super({
            ...data,
            options: [],
        });
    }

    get Type(): ApplicationCommandOptionType.Subcommand {
        return ApplicationCommandOptionType.Subcommand;
    }

    get Options(): readonly BaseOption<any, any>[] {
        return [...this.options];
    }

    addStringOption<
        TName extends string,
        TValue extends string,
        TRequired extends boolean = false,
        TOptionMode extends OptionMode = 'root',
        THasDefault extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: StringOption<string, false, 'root', false>,
        ) => TCanHaveRequired extends true
            ? StringOption<TValue, TRequired, TOptionMode, THasDefault>
            : StringOption<TValue, false, TOptionMode, THasDefault>,
    ) {
        this.addOption(new StringOption(data), transform);
        return this as SubCommand<
            Simplify<TArgs & MakeOption<TName, TValue, TRequired, THasDefault>>,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    addBooleanOption<
        TName extends string,
        TRequired extends boolean = false,
        THasDefault extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: BooleanOption<false>,
        ) => TCanHaveRequired extends true
            ? BooleanOption<TRequired, THasDefault>
            : BooleanOption<false, THasDefault>,
    ) {
        this.addOption(new BooleanOption(data), transform);
        return this as SubCommand<
            Simplify<
                TArgs & MakeOption<TName, boolean, TRequired, THasDefault>
            >,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    addIntegerOption<
        TName extends string,
        TValue extends number,
        TRequired extends boolean = false,
        TOptionMode extends OptionMode = 'root',
        THasDefault extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: IntegerOption<number, false, 'root', false>,
        ) => TCanHaveRequired extends true
            ? IntegerOption<TValue, TRequired, TOptionMode, THasDefault>
            : IntegerOption<TValue, false, TOptionMode, THasDefault>,
    ) {
        this.addOption(new IntegerOption(data), transform);
        return this as SubCommand<
            Simplify<TArgs & MakeOption<TName, TValue, TRequired, THasDefault>>,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    addUserOption<
        TName extends string,
        TRequired extends boolean = false,
        THasDefault extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: UserOption<false, false>,
        ) => TCanHaveRequired extends true
            ? UserOption<TRequired, THasDefault>
            : UserOption<false, THasDefault>,
    ) {
        this.addOption(new UserOption(data), transform);
        return this as SubCommand<
            Simplify<
                TArgs &
                    MakeOption<
                        TName,
                        { user: User; member?: GuildMember },
                        TRequired,
                        THasDefault
                    >
            >,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    addChannelOption<
        TName extends string,
        TRequired extends boolean = false,
        THasDefault extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: ChannelOption<false, false>,
        ) => TCanHaveRequired extends true
            ? ChannelOption<TRequired, THasDefault>
            : ChannelOption<false, THasDefault>,
    ) {
        this.addOption(new ChannelOption(data), transform);
        return this as SubCommand<
            Simplify<
                TArgs & MakeOption<TName, Channel, TRequired, THasDefault>
            >,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    addRoleOption<
        TName extends string,
        TRequired extends boolean = false,
        THasDefault extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: RoleOption<false, false>,
        ) => TCanHaveRequired extends true
            ? RoleOption<TRequired, THasDefault>
            : RoleOption<false, THasDefault>,
    ) {
        this.addOption(new RoleOption(data), transform);
        return this as SubCommand<
            Simplify<TArgs & MakeOption<TName, Role, TRequired, THasDefault>>,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    addMentionableOption<
        TName extends string,
        TRequired extends boolean = false,
        THasDefault extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: MentionableOption<false, false>,
        ) => TCanHaveRequired extends true
            ? MentionableOption<TRequired, THasDefault>
            : MentionableOption<false, THasDefault>,
    ) {
        this.addOption(new MentionableOption(data), transform);
        return this as SubCommand<
            Simplify<
                TArgs &
                    MakeOption<
                        TName,
                        { user?: User; member?: GuildMember; role?: Role },
                        TRequired,
                        THasDefault
                    >
            >,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    addNumberOption<
        TName extends string,
        TValue extends number,
        TRequired extends boolean = false,
        TOptionMode extends OptionMode = 'root',
        THasDefault extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: NumberOption<number, false, 'root', false>,
        ) => TCanHaveRequired extends true
            ? NumberOption<TValue, TRequired, TOptionMode, THasDefault>
            : NumberOption<TValue, false, TOptionMode, THasDefault>,
    ) {
        this.addOption(new NumberOption(data), transform);
        return this as SubCommand<
            Simplify<TArgs & MakeOption<TName, TValue, TRequired, THasDefault>>,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    addAttachmentOption<
        TName extends string,
        TRequired extends boolean = false,
    >(
        this: SubCommand<TArgs, TCanHaveRequired>,
        data: NamedOption<TName>,
        transform?: (
            option: AttachmentOption<false>,
        ) => TCanHaveRequired extends true
            ? AttachmentOption<TRequired>
            : AttachmentOption<false>,
    ) {
        this.addOption(new AttachmentOption(data), transform);
        return this as SubCommand<
            Simplify<TArgs & MakeOption<TName, Attachment, TRequired, false>>,
            TCanHaveRequired extends true ? TRequired : false
        >;
    }

    private addOption<
        T extends SubCommandChildOption,
        Q extends SubCommandChildOption,
    >(option: T, transform?: (option: T) => Q) {
        let opt;
        try {
            opt = transform ? transform(option) : option;
        } catch (error) {
            if (!(error instanceof KawaiiValidationError)) {
                throw error;
            }

            throw new KawaiiValidationError(
                error.message,
                `${this.data.name}.${error.path}`,
            );
        }

        if (opt.IsRequired && !this.canPushRequired) {
            throw new KawaiiValidationError(
                `Caught required option '${opt.Name}' after non-required options in command ${this.Name}`,
                `${this.data.name}.${opt.Name}`,
            );
        }

        this.canPushRequired = opt.IsRequired;
        this.options.push(opt);
    }

    toJSON(): APIApplicationCommandSubcommandOption {
        return {
            ...this.data,
            type: ApplicationCommandOptionType.Subcommand,
            options: this.options.map((i) => i.toJSON()),
        };
    }
}
