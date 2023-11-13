import { DotenvRunOptions } from "@dotenv-run/core";
import type { Configuration } from "webpack";
export declare function plugin(options: DotenvRunOptions, ssr?: boolean): {
    webpackConfiguration: (webpackConfig: Configuration) => Promise<Configuration>;
    indexHtml: (content: string) => Promise<string>;
};
