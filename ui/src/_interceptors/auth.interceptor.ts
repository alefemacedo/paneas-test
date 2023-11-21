import {
    HttpInterceptorFn,
    HttpRequest,
    HttpHandlerFn,
    HttpErrorResponse
} from "@angular/common/http";
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Auth } from "@services/http";
import { Storage } from '@services/storage.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {

    const storage: Storage = new Storage();
    const router = inject(Router);
    const auth = inject(Auth);
    if (!/\/api\/authenticate|\/users\/register/.test(req.url)) {
        const accessToken = storage.get('access_token');
        const modifiedReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
        });

        return next(modifiedReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Tenta-se fazer o refresh do token
                    const refreshToken = storage.get('refresh_token');
                    return auth.create('refresh-token', { refresh: refreshToken }).pipe(
                        switchMap((response: any) => {
                            storage.set('access_token', response.access);
                            storage.set('refresh_token', response.refresh);

                            // Clona os parâmetros da requisição original e seta o novo access token
                            const updatedRequest = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${response.access}`
                                },
                            });

                            return next(updatedRequest);
                        }),
                        catchError((refreshError) => {
                            // Trata o erro do refresh token deslogando o usuário e enviando para a tela de login
                            console.log('Requisição não autorizada. Redirecionando para a tela de login.');
                            console.log(error);
                            storage.clear();
                            router.navigateByUrl('/login');
                            return throwError(() => refreshError);
                        })
                    )
                }

                // Retorna uma nova instância do erro (relança) de modo a propagá-lo ao subscriber
                return throwError(() => error);
            })
        );

    } else {
        return next(req);
    }
};