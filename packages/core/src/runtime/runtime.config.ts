import { InjectionToken } from "@angular/core";

export interface NgxEnvRuntimeConfig {
  files: string[];
  failOnError?: boolean;
  debug?: boolean;
}

export const RUNTIME_CONFIG_TOKEN = new InjectionToken<NgxEnvRuntimeConfig>(
  "NgxEnv Config"
);
