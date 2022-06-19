import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  NgxEnvModule,
  // NgxEnvRuntime,
  // NgxEnvRuntimeConfig,
  // NgxEnvRuntimeLoader,
  // NgxEnvRuntimeService,
} from '@ngx-env/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// class NgxEnvLoader implements NgxEnvRuntimeLoader {
//   load(config: NgxEnvRuntimeConfig): Observable<unknown[]> {
//     return of([
//       {
//         baseUrl: 'myUrl',
//       },
//     ]);
//   }
// }

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    // {
    //   provide: NgxEnvRuntime,
    //   useClass: NgxEnvLoader,
    // },
    importProvidersFrom(
      NgxEnvModule.config({
        files: environment.production
          ? [`/assets/environments/env.${environment.env.NG_APP_ENV}.json`]
          : [
              `/assets/environments/env.${environment.env.NG_APP_ENV}.json`,
              `/assets/environments/env.local.json`,
            ],
      })
    ),
    // NgxEnvRuntimeService.config({
    //   files: environment.production
    //     ? [`/assets/environments/env.${environment.env.NG_APP_ENV}.json`]
    //     : [
    //         `/assets/environments/env.${environment.env.NG_APP_ENV}.json`,
    //         `/assets/environments/env.local.json`,
    //       ],
    // }),
  ],
}).catch((err) => console.error(err));
