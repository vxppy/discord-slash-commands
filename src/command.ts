import type {
    Attachment,
    Channel,
    ChatInputCommandInteraction,
    GuildMember,
    Role,
    User,
} from 'discord.js';

import { SubCommand, SubCommandGroup } from './options/group/index.js';
import {
    AttachmentOption,
    BooleanOption,
    ChannelOption,
    IntegerOption,
    MentionableOption,
    NumberOption,
    RoleOption,
    StringOption,
    UserOption,
} from './options/value/index.js';

import type {
    LocalizationMap,
    MakeOption,
    NamedOption,
    OptionMode,
    Simplify,
    XORIfNotEmpty,
} from './types/shared.js';

import VxppyValidationError from './error.js';
import type { ApplicationCommandData } from './options/base.js';
import { parseOptions } from './parseOptions.js';
import type {
    VxppyCommandContext,
    VxppySlashCommandMetadata,
} from './types/exported.js';

type SlashCommandState = 'root' | 'subcommand' | 'options';

export interface SlashCommandContext<TArgs> {
    interaction: ChatInputCommandInteraction;
    ctx: VxppyCommandContext;
    options: TArgs;
}

export type SlashCommandCallback<TArgs> = (
    ctx: SlashCommandContext<TArgs>,
) => any;

interface SlashCommandData {
    readonly name: string;
    name_localizations?: LocalizationMap;

    readonly description: string;
    description_localizations?: LocalizationMap;

    options: ApplicationCommandData[];
    nsfw?: boolean;
}

type AnyOption =
    | StringOption<any, any, any, any>
    | IntegerOption<any, any, any, any>
    | BooleanOption<any, any>
    | UserOption<any, any>
    | ChannelOption<any, any>
    | RoleOption<any, any>
    | MentionableOption<any, any>
    | NumberOption<any, any, any, any>
    | AttachmentOption<any>
    | SubCommand<any, any>
    | SubCommandGroup<any>;

export class VxppySlashCommand<
    TMetadata extends object = {},
    TArgs extends unknown = {},
    TCanHaveRequired extends boolean = true,
    TState extends SlashCommandState = 'root',
> {
    declare private state: TState;

    private data: SlashCommandData;

    private executeFn!: SlashCommandCallback<TArgs>;
    private props: Partial<TMetadata> = {};
    private canPushRequired = true;
    private options: AnyOption[] = [];

    constructor({ name, description }: { name: string; description: string }) {
        this.data = {
            name,
            description,
            options: [],
        };
    }

    get Name() {
        return this.data.name;
    }

    get Options(): readonly AnyOption[] {
        return [...this.options];
    }

    nameLocalizations(localizations: LocalizationMap) {
        this.data.name_localizations = localizations;
    }

    descriptionLocalizations(localizations: LocalizationMap) {
        this.data.description_localizations = localizations;
    }

    nsfw() {
        this.data.nsfw = true;
    }

    callback(callback: SlashCommandCallback<TArgs>) {
        this.executeFn = callback;
        return this;
    }

    async execute<TCtx extends object = VxppyCommandContext>(
        interaction: ChatInputCommandInteraction,
        ctx: TCtx,
    ) {
        this.executeFn({
            interaction,
            ctx,
            options: (await parseOptions(interaction, this.Options)) as TArgs,
        });
    }

    addStringOption<
        TName extends string,
        TValue extends string,
        TRequired extends boolean = false,
        TOptionMode extends OptionMode = 'root',
        THasDefault extends boolean = false,
    >(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: StringOption<string, false, 'root', false>,
        ) => TCanHaveRequired extends true
            ? StringOption<TValue, TRequired, TOptionMode, THasDefault>
            : StringOption<TValue, false, TOptionMode, THasDefault>,
    ) {
        this.addOption(new StringOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<TArgs & MakeOption<TName, TValue, TRequired, THasDefault>>,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addBooleanOption<
        TName extends string,
        TRequired extends boolean = false,
        THasDefault extends boolean = false,
    >(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: BooleanOption<false, false>,
        ) => TCanHaveRequired extends true
            ? BooleanOption<TRequired, THasDefault>
            : BooleanOption<false, THasDefault>,
    ) {
        this.addOption(new BooleanOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<
                TArgs & MakeOption<TName, boolean, TRequired, THasDefault>
            >,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addIntegerOption<
        TName extends string,
        TValue extends number,
        TRequired extends boolean = false,
        TOptionMode extends OptionMode = 'root',
        THasDefault extends boolean = false,
    >(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: IntegerOption<number, false, 'root', false>,
        ) => TCanHaveRequired extends true
            ? IntegerOption<TValue, TRequired, TOptionMode, THasDefault>
            : IntegerOption<TValue, false, TOptionMode, THasDefault>,
    ) {
        this.addOption(new IntegerOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<TArgs & MakeOption<TName, TValue, TRequired, THasDefault>>,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addUserOption<TName extends string, TRequired extends boolean = false>(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: UserOption<false, false>,
        ) => TCanHaveRequired extends true
            ? UserOption<TRequired, boolean>
            : UserOption<false, boolean>,
    ) {
        this.addOption(new UserOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<
                TArgs &
                    MakeOption<
                        TName,
                        { user: User; member?: GuildMember },
                        TRequired,
                        false
                    >
            >,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addRoleOption<TName extends string, TRequired extends boolean = false>(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: RoleOption<false, false>,
        ) => TCanHaveRequired extends true
            ? RoleOption<TRequired, boolean>
            : RoleOption<false, boolean>,
    ) {
        this.addOption(new RoleOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<TArgs & MakeOption<TName, Role, TRequired, false>>,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addMentionableOption<
        TName extends string,
        TRequired extends boolean = false,
    >(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: MentionableOption<false, false>,
        ) => TCanHaveRequired extends true
            ? MentionableOption<TRequired, boolean>
            : MentionableOption<false, boolean>,
    ) {
        this.addOption(new MentionableOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<
                TArgs &
                    MakeOption<
                        TName,
                        { user?: User; member?: GuildMember; role?: Role },
                        TRequired,
                        false
                    >
            >,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addChannelOption<TName extends string, TRequired extends boolean = false>(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: ChannelOption<false, false>,
        ) => TCanHaveRequired extends true
            ? ChannelOption<TRequired, boolean>
            : ChannelOption<false, boolean>,
    ) {
        this.addOption(new ChannelOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<TArgs & MakeOption<TName, Channel, TRequired, false>>,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addNumberOption<
        TName extends string,
        TValue extends number,
        TRequired extends boolean = false,
        TOptionMode extends OptionMode = 'root',
        THasDefault extends boolean = false,
    >(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: NumberOption<number, false, 'root', false>,
        ) => TCanHaveRequired extends true
            ? NumberOption<TValue, TRequired, TOptionMode, THasDefault>
            : NumberOption<TValue, false, TOptionMode, THasDefault>,
    ) {
        this.addOption(new NumberOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<TArgs & MakeOption<TName, TValue, TRequired, THasDefault>>,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addAttachmentOption<
        TName extends string,
        TRequired extends boolean = false,
    >(
        this: VxppySlashCommand<
            TMetadata,
            TArgs,
            TCanHaveRequired,
            'root' | 'options'
        >,
        data: NamedOption<TName>,
        transform?: (
            option: AttachmentOption<false>,
        ) => TCanHaveRequired extends true
            ? AttachmentOption<TRequired>
            : AttachmentOption<false>,
    ) {
        this.addOption(new AttachmentOption(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            Simplify<TArgs & MakeOption<TName, Attachment, TRequired, false>>,
            TCanHaveRequired extends true ? TRequired : false,
            'options'
        >;
    }

    addSubCommand<
        TName extends string,
        TShape extends {},
        TCanHaveRequired extends boolean = true,
    >(
        this: VxppySlashCommand<TMetadata, TArgs, true, 'root' | 'subcommand'>,
        data: NamedOption<TName>,
        transform?: (
            sub: SubCommand<{}, true>,
        ) => SubCommand<TShape, TCanHaveRequired>,
    ) {
        this.addOption(new SubCommand(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            XORIfNotEmpty<TArgs, MakeOption<TName, TShape, true, false>>,
            true,
            'subcommand'
        >;
    }

    addSubCommandGroup<TName extends string, TShape extends {}>(
        this: VxppySlashCommand<TMetadata, any, true, 'root' | 'subcommand'>,
        data: NamedOption<TName>,
        transform?: (group: SubCommandGroup<{}>) => SubCommand<TShape>,
    ) {
        this.addOption(new SubCommandGroup(data), transform);
        return this as VxppySlashCommand<
            TMetadata,
            XORIfNotEmpty<TArgs, MakeOption<TName, TShape, true, false>>,
            true,
            'subcommand'
        >;
    }

    private addOption<T extends AnyOption, Q extends AnyOption>(
        option: T,
        transform?: (option: T) => Q,
    ) {
        let opt;
        try {
            opt = transform ? transform(option) : option;
        } catch (error) {
            if (!(error instanceof VxppyValidationError)) {
                throw error;
            }

            throw new VxppyValidationError(
                error.message,
                `${this.data.name}.${error.path}`,
            );
        }

        if (opt.IsRequired && !this.canPushRequired) {
            throw new VxppyValidationError(
                `Caught required option '${opt.Name}' after non-required options in command ${this.Name}`,
                `${this.data.name}.${opt.Name}`,
            );
        }

        this.canPushRequired = opt.IsRequired;
        this.options.push(opt);
    }

    setProps(data: Partial<TMetadata>) {
        Object.assign(this.props, data);
        return this;
    }

    getProp<K extends keyof TMetadata>(x: K) {
        return this.props[x] as TMetadata[K];
    }

    toJSON() {
        if (!this.data.description) {
            throw new VxppyValidationError(
                `Name not found for command 'unknown'`,
                'unknown',
                true,
            );
        }

        if (!this.data.description) {
            throw new VxppyValidationError(
                `Description not found for command ${this.data.name}`,
                this.data.name,
                true,
            );
        }

        return {
            ...this.data,
            options: this.options.map((i) => i.toJSON()),
        };
    }
}

export const slashCommand = <
    TMetadata extends object = VxppySlashCommandMetadata,
>(data: {
    name: string;
    description: string;
}) => {
    return new VxppySlashCommand<TMetadata>(data);
};
