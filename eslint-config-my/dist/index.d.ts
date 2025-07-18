import * as eslint from 'eslint';

type Options = {
    scopes?: {
        js?: boolean;
        ts?: boolean;
        stylistic?: boolean;
        tailwindcss?: boolean;
        react?: boolean;
        vue?: boolean;
    };
    ignores?: string[];
};
declare function export_default(options?: Options): eslint.Linter.Config<eslint.Linter.RulesRecord>[];

export { type Options, export_default as default };
