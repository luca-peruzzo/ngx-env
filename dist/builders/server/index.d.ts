import { BuilderContext } from "@angular-devkit/architect";
import { executeServerBuilder, ServerBuilderOptions } from "@angular-devkit/build-angular";
import { NgxEnvSchema } from "../ngx-env/ngx-env-schema";
export declare const buildWithPlugin: (options: ServerBuilderOptions & NgxEnvSchema, context: BuilderContext) => ReturnType<typeof executeServerBuilder>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<ServerBuilderOptions & import("@angular-devkit/core").JsonObject>;
export default _default;
