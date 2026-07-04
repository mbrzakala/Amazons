import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConfigProvider } from './config.provider';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(ConfigProvider);
  const baseUrl = config.apiUrl();

  if (!req.url.startsWith('http')) {
    req = req.clone({ url: `${baseUrl}${req.url}` });
  }

  return next(req);
};
