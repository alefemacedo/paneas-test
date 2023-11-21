import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Storage } from '@services/storage.service';

export const authGuard: CanActivateFn = (route, state) => {
    const storage: Storage = new Storage();
    const logged = !!(storage.get('access_token') && storage.get('refresh_token'));

    if (!logged) {
        storage.clear();
        return inject(Router).createUrlTree(["/", "login"]);
    }

    return true;
};
