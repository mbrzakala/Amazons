import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { apiInterceptor } from './core/api.interceptor';
import { API_CONFIG, DEFAULT_API_CONFIG } from './core/config.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    { provide: API_CONFIG, useValue: DEFAULT_API_CONFIG },
  ],
};
