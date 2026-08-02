export default class KawaiiValidationError extends Error {
    constructor(
        message: string,
        readonly path: string,
        readonly root: boolean = false,
    ) {
        const isColorSupported =
            process.stdout.isTTY && process.env.TERM !== 'dumb';
        super(
            root
                ? `${message}\n    at ${isColorSupported ? `\x1b[32mKawaiiSlashCommand::\x1b[0m \x1b[1m${path}\x1b[0m` : `KawaiiSlashCommand:: ${path}`}\n`
                : `${message}`,
        );
    }
}
