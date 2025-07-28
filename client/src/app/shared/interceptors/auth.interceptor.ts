import { HttpEvent, HttpHandler, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const authService = inject(AuthService);

    const token = authService.getAuthToken();
    const cloned = !!token
        ? req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`)
          })
        : req;

    return next(cloned).pipe(
        catchError((err: HttpResponse<unknown>) => {
            if (!err.ok) authService.resetAuthToken();
            return next(cloned);
        })
    );
}
