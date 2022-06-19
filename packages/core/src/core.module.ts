import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { EnvPipe } from "./env.pipe";
import { NgxEnvRuntimeService } from "./public_api";
import { NgxEnvRuntimeConfig } from "./runtime/runtime.config";

@NgModule({
  declarations: [EnvPipe],
  exports: [EnvPipe],
})
export class NgxEnvModule {
  static forRoot(
    config: NgxEnvRuntimeConfig
  ): ModuleWithProviders<NgxEnvModule> {
    return {
      ngModule: NgxEnvModule,
      providers: [NgxEnvRuntimeService.config(config)],
    };
  }

  static config(
    config: NgxEnvRuntimeConfig
  ): ModuleWithProviders<NgxEnvModule> {
    return this.forRoot(config);
  }
}
