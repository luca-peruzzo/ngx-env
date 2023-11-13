import { BuilderContext } from "@angular-devkit/architect";
import { DevServerBuilderOptions, DevServerBuilderOutput } from "@angular-devkit/build-angular";
import { Observable } from "rxjs";
import { NgxEnvSchema } from "../ngx-env/ngx-env-schema";
export declare const buildWithPlugin: (options: DevServerBuilderOptions & NgxEnvSchema, context: BuilderContext) => Observable<DevServerBuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<DevServerBuilderOptions & import("@angular-devkit/core").JsonObject>;
export default _default;
