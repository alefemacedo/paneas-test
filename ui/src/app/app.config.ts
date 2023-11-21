import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { VERSION as MAT_VERSION, MatNativeDateModule } from '@angular/material/core';

import { authInterceptor, baseURLInterceptor } from '@interceptors/index';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(
            withInterceptors([baseURLInterceptor, authInterceptor])
        ),
        importProvidersFrom(MatNativeDateModule)
    ]
};
