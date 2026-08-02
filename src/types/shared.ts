import type { Locale } from 'discord-api-types/v10';

export type Simplify<T> = {
    [K in keyof T]: T[K];
} & {};

export type MakeOption<
    TName extends string,
    TType,
    TRequired extends boolean,
    THasDefault extends boolean,
> = TRequired extends true
    ? { [K in TName]: TType }
    : THasDefault extends true
      ? { [K in TName]: TType }
      : { [K in TName]?: TType };

export interface RequiredOptionFields {
    name: string;
    description: string;
}

export interface NamedOption<TName extends string> {
    name: TName;
    description: string;
}

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<A, B> = A | B extends object
    ? Simplify<Without<A, B> & B> | Simplify<Without<B, A> & A>
    : A | B;

export type UnionIfNotEmpty<T, TOther> = keyof T extends never
    ? TOther
    : T | TOther;

export type XORIfNotEmpty<TValue, TOther> = keyof TValue extends never
    ? TOther
    : XOR<TValue, TOther>;

export type LocalizationMap = Partial<Record<Locale, string>>;
export type OptionMode = 'root' | 'raw' | 'choice';
export type DefaultValue<T> = T | undefined;
