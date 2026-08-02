import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import {
    GuildMember,
    Role,
    type ChatInputCommandInteraction,
} from 'discord.js';

interface OptionShape {
    Type: ApplicationCommandOptionType;
    Name: string;

    DefaultValue?: unknown;
    Required?: boolean;
    Options?: readonly OptionShape[];
}

const assign = <T>(
    target: Record<string, unknown>,
    key: string,
    value: T | null,
    defaultValue: T,
) => {
    if (value !== null) {
        target[key] = value;
    } else if (defaultValue !== undefined) {
        target[key] = defaultValue;
    }
};

export async function parseOptions(
    interaction: ChatInputCommandInteraction,
    shape: readonly OptionShape[],
) {
    const result: Record<string, unknown> = {};
    let target: Record<string, unknown> = result;

    let sub;
    if ((sub = interaction.options.getSubcommandGroup(false))) {
        target = target[sub] = {};
        shape = shape.find((i) => i.Name == sub!)!.Options!;
    }

    if ((sub = interaction.options.getSubcommand(false))) {
        target = target[sub] = {};
        shape = shape.find((i) => i.Name == sub!)!.Options!;
    }

    for (const {
        Name: name,
        Type: type,
        Required: required,
        DefaultValue: defaultValue,
    } of shape) {
        switch (type) {
            case ApplicationCommandOptionType.String: {
                const value = interaction.options.getString(name, required);
                assign(target, name, value, defaultValue);

                break;
            }
            case ApplicationCommandOptionType.Boolean: {
                const value = interaction.options.getBoolean(name, required);
                assign(target, name, value, defaultValue);

                break;
            }
            case ApplicationCommandOptionType.Integer: {
                const value = interaction.options.getInteger(name, required);
                assign(target, name, value, defaultValue);

                break;
            }
            case ApplicationCommandOptionType.User: {
                const user = interaction.options.getUser(name, required);

                if (user !== null) {
                    target[name] = result[name] = {
                        user: user,
                        member:
                            interaction.options.getMember(name) || undefined,
                    };
                }

                break;
            }
            case ApplicationCommandOptionType.Channel: {
                const value = interaction.options.getChannel(name, required);
                if (value !== null) {
                    target[name] = value;
                } else if (defaultValue !== undefined) {
                    target[name] = await interaction.client.channels.fetch(
                        defaultValue as string,
                    );
                }

                break;
            }
            case ApplicationCommandOptionType.Role: {
                const value = interaction.options.getRole(name, required);

                if (value !== null) {
                    target[name] = value;
                } else if (defaultValue !== undefined) {
                    target[name] = await interaction.guild?.roles.fetch(
                        defaultValue as string,
                    );
                }

                break;
            }
            case ApplicationCommandOptionType.Mentionable: {
                const mentionable = interaction.options.getMentionable(
                    name,
                    required,
                );

                if (mentionable !== null) {
                    if (mentionable instanceof Role) {
                        target[name] = {
                            role: mentionable,
                        };
                    } else if (mentionable instanceof GuildMember) {
                        target[name] = {
                            user: mentionable.user,
                            member: mentionable,
                        };
                    } else {
                        target[name] = {
                            user: mentionable,
                            member:
                                interaction.options.getMember(name) ||
                                undefined,
                        };
                    }
                } else if (defaultValue !== undefined) {
                    const v = defaultValue as { role?: string; user?: string };
                    if (v.role) {
                        target[name] = {
                            role: await interaction.guild?.roles.fetch(v.role),
                        };
                    } else if (v.user) {
                        target[name] = {
                            user: await interaction.client.users.fetch(v.user),
                            member: await interaction.guild?.members.fetch(
                                v.user,
                            ),
                        };
                    }
                }
                break;
            }
            case ApplicationCommandOptionType.Number: {
                const value = interaction.options.getNumber(name, required);
                assign(target, name, value, defaultValue);

                break;
            }
            case ApplicationCommandOptionType.Attachment: {
                const value = interaction.options.getAttachment(name, required);
                assign(target, name, value, undefined);

                break;
            }
        }
    }

    return result;
}
