import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxEnvModule } from '@ngx-env/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxEnvModule],
  // providers: [
  //   NgxEnvRuntime,
  //   {
  //     provide: NGX_ENV_RUNTIME,
  //     useValue: ['./assets/config/environment.production.json'],
  //   },
  // ],
  bootstrap: [AppComponent],
})
export class AppModule {}
