import { ApplicationBuilderOptions } from "@angular-devkit/build-angular";
import { DotenvRunOptions } from "@dotenv-run/core";
import type { Plugin } from "esbuild";
import { NgxEnvSchema } from "./ngx-env/ngx-env-schema";
export declare function plugin(options: DotenvRunOptions): Plugin[];
export declare function indexHtml(options: ApplicationBuilderOptions & NgxEnvSchema, dotEnvOptions: DotenvRunOptions): void;
