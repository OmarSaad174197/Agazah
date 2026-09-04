import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  registerLocaleData
} from '@angular/common';

import localeAr from '@angular/common/locales/ar';

import {
  MatPaginatorIntl
} from '@angular/material/paginator';

import {
  routes
} from './app.routes';

import {
  errorInterceptor
} from './core/interceptors/error.interceptor';

import {
  getArabicPaginator
} from './core/services/paginator-arabic.service';

registerLocaleData(localeAr);

export const appConfig: ApplicationConfig = {

  providers: [

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        errorInterceptor
      ])
    ),

    {
      provide: LOCALE_ID,
      useValue: 'ar-EG'
    },

    {
      provide: MatPaginatorIntl,
      useValue: getArabicPaginator()
    }
  ]
};
