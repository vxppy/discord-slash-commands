export default class VxppyValidationError extends Error {
    constructor(
        message: string,
        readonly path: string,
        readonly root: boolean = false,
    ) {
        const isColorSupported =
            process.stdout.isTTY && process.env.TERM !== 'dumb';
        super(
            root
                ? `${message}\n    at ${isColorSupported ? `\x1b[32mVxppySlashCommand::\x1b[0m \x1b[1m${path}\x1b[0m` : `VxppySlashCommand:: ${path}`}\n`
                : `${message}`,
        );
    }
}
