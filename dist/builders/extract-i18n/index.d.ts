import { BuilderContext } from "@angular-devkit/architect";
import { ExtractI18nBuilderOptions, executeExtractI18nBuilder } from "@angular-devkit/build-angular";
import { NgxEnvSchema } from "../ngx-env/ngx-env-schema";
export declare const buildWithPlugin: (options: ExtractI18nBuilderOptions & NgxEnvSchema, context: BuilderContext) => ReturnType<typeof executeExtractI18nBuilder>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<ExtractI18nBuilderOptions & import("@angular-devkit/core").JsonObject>;
export default _default;
