import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom(SweetAlert2Module.forRoot()),
  ],
}).catch((err) => console.error(err));