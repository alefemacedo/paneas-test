import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from "@angular/common/http";

export const baseURLInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    // Add your default base URL here
    const baseUrl = 'http://127.0.0.1:8000';

    // Clone the request and set the new URL
    const modifiedReq = req.clone({
      url: `${baseUrl}/${req.url}`,
    });

    // Pass the modified request to the next handler
    return next(modifiedReq);
};