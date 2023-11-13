import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ngx-env-v17-demo';
  env = import.meta.env['NG_APP_ENV'];
  version = environment.env.NG_APP_VERSION;
  appHome = import.meta.env['NG_APP_USER_HOME'];
  home = import.meta.env['NG_APP_USER_HOME'];
}
