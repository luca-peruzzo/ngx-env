import { BuilderContext } from "@angular-devkit/architect";
import { ApplicationBuilderOptions } from "@angular-devkit/build-angular";
import { NgxEnvSchema } from "../ngx-env/ngx-env-schema";
export declare const buildWithPlugin: (options: ApplicationBuilderOptions & NgxEnvSchema, context: BuilderContext) => import("rxjs").Observable<import("@angular-devkit/core").JsonObject & import("@angular-devkit/architect/src/output-schema").Schema & {
    outputFiles?: import("@angular-devkit/build-angular/src/tools/esbuild/bundler-context").BuildOutputFile[];
    assetFiles?: {
        source: string;
        destination: string;
    }[];
}>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<ApplicationBuilderOptions & import("@angular-devkit/core").JsonObject>;
export default _default;
