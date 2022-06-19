import { Component } from '@angular/core';
import { NgxEnvModule, NgxEnvRuntimeService } from '@ngx-env/core';
import { environment } from 'src/environments/environment';

export interface RuntimeEnvironment {
  baseUrl: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [NgxEnvModule],
})
export class AppComponent {
  env = process.env.NG_APP_ENV;
  version = environment.env.NG_APP_VERSION;
  branch = process.env.NG_APP_BRANCH_NAME;
  home = process.env.USER_HOME;
  appHome = process.env.NG_APP_USER_HOME;
  notInTest = process.env.NG_APP_NOT_IN_TEST;
  constructor(ngxEnv: NgxEnvRuntimeService) {
    const env = ngxEnv.getEnvironment<RuntimeEnvironment>();
    console.log(env.baseUrl);
  }
}
