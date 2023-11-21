import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";

export const baseURLInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    // Define a baseURL a ser utilizada para todas as requisições AJAX
    const baseURL = 'http://127.0.0.1:8000';

    // Clona a requisição e concatena a baseURL
    const modifiedReq = req.clone({
      url: `${baseURL}/${req.url}`,
    });

    // Passa a requisição alterada para o next de modo a continuar
    return next(modifiedReq);
};