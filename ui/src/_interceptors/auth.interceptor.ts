import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpErrorResponse,
    HttpResponse
} from "@angular/common/http";
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Auth } from "@services/http";
import { Storage } from '@services/storage.service'

const handleError = (
    error: HttpErrorResponse,
    storage: Storage,
    router: Router,
    auth: Auth
) => {
    console.log(error)
    // Trata o response 401 Unauthorized
    
}

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {

    const storage: Storage = new Storage()
    const router = inject(Router)
    const auth = inject(Auth)
    if (!/\/api\/authenticate|\/users\/register/.test(req.url)) {
        const accessToken = storage.get('access_token');
        const modifiedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        });

        return next(modifiedReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Tenta-se fazer o refresh do token
                    const refreshToken = storage.get('refresh_token')
                    return auth.create('refresh-token', { refresh: refreshToken }).pipe(
                        switchMap((response: any) => {
                            storage.set('access_token', response.access)
                            storage.set('refresh_token', response.refresh)

                            // Clone the original request and set the new token
                            const updatedRequest = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${response.access}`
                                },
                            });

                            return next(updatedRequest);
                        }),
                        catchError((refreshError) => {
                            // Handle refresh error (e.g., redirect to login)
                            console.log('Requisição não autorizada. Redirecionando para a tela de login.');
                            console.log(error)
                            storage.clear()
                            router.navigateByUrl('/login')
                            return throwError(() => refreshError);
                        })
                    )
                }

                // Re-throw the error to propagate it to the subscriber
                return throwError(() => error);
            })
        );

    } else {
        return next(req)
    }
};