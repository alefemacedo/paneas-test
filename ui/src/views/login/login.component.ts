import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
    FormGroup,
    FormControl,
    Validators,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Auth } from '@services/http/index';
import { Storage } from '@services/storage.service';

@Component({
    selector: 'ui-login',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.sass'
})
export class LoginComponent {
    constructor(
        public auth: Auth,
        public router: Router,
        private _snackBar: MatSnackBar,
        private storage: Storage
    ) {}

    formControl: FormGroup = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(2)])
    });

    /**
     * Input handler que verifica se os campos de email e senha ainda contêm os status
     * de erro
     */
    inputHandler() {
        let email = this.formControl.get('email');
        let password = this.formControl.get('password');
        if (email?.hasError('emailNotMatched') || password?.hasError('passwordNotMatched')) {
            email?.setErrors({ 'emailNotMatched': null });
            password?.setErrors({ 'passwordNotMatched': null });
            email?.updateValueAndValidity();
            password?.updateValueAndValidity();
        }
    }

    /**
     * Realiza a requisição para fazer login no sistema
     */
    login() {
        this.auth.create('authenticate', this.formControl.value).subscribe({
            next: (response: any) => {
                this.storage.set('access_token', response.access);
                this.storage.set('refresh_token', response.refresh);
                this.router.navigateByUrl('');
            },
            error: (error: any) => {
                console.log(error);
                if (error.status === 401) {
                    this._snackBar.open(
                        'Falha na autenticação! Usuário ou senha incorretos.',
                        'Fechar',
                        { duration: 5000 }
                    );
                    this.formControl.controls['email'].setErrors({ 'emailNotMatched': true });
                    this.formControl.controls['password'].setErrors({ 'passwordNotMatched': true });

                } else if (error.message) {
                    this._snackBar.open(error.message, 'Fechar', { duration: 5000 });
                }
            }
        });
    }
}
