import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlingService } from '../error-handling.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorHandlingService);
  return next(req).pipe(
    catchError((error) => {
      errorService.error.next(error.error.message);
      return throwError(() => new Error(error));
    })
  );
};
