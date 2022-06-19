import { HttpClient } from "@angular/common/http";
import {
  APP_INITIALIZER,
  Inject,
  Injectable,
  InjectionToken,
  Optional,
} from "@angular/core";
import { catchError, forkJoin, Observable, of, tap } from "rxjs";
import { NgxEnvRuntimeConfig, RUNTIME_CONFIG_TOKEN } from "./runtime.config";

function initializeAppFactory(
  runtimeEnvService: NgxEnvRuntimeService
): () => Observable<unknown[]> {
  return () => runtimeEnvService.loadEnvironment();
}

export const NgxEnvRuntime = new InjectionToken("NgxEnv Custom Loader");

export interface NgxEnvRuntimeLoader {
  load(config: NgxEnvRuntimeConfig): Observable<unknown[]>;
}

@Injectable({
  providedIn: "root",
})
export class NgxEnvRuntimeService implements NgxEnvRuntimeLoader {
  private environment: unknown;

  constructor(
    private readonly http: HttpClient,
    @Optional()
    @Inject(NgxEnvRuntime)
    private readonly customLoader: NgxEnvRuntimeLoader,
    @Inject(RUNTIME_CONFIG_TOKEN) private readonly config: NgxEnvRuntimeConfig
  ) {}

  static config = (config: NgxEnvRuntimeConfig) => [
    {
      provide: RUNTIME_CONFIG_TOKEN,
      useValue: {
        debug: false,
        failOnError: false,
        ...config,
      },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [NgxEnvRuntimeService],
      multi: true,
    },
  ];

  loadEnvironment() {
    return (
      this.customLoader
        ? this.customLoader.load(this.config)
        : this.load(this.config)
    ).pipe(
      tap((environments: any[]) => {
        this.environment = environments.reduce((acc, cur) => {
          return (acc = { ...acc, ...cur });
        }, {});
      })
    );
  }

  load(config: NgxEnvRuntimeConfig): Observable<unknown[]> {
    return forkJoin(
      config.files.map((file) =>
        this.http.get<string>(file).pipe(
          catchError((e) => {
            console.log(e.message);
            return of({});
          })
        )
      )
    );
  }

  getEnvironment<T>(): T {
    return this.environment as T;
  }
}
