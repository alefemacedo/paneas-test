import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { confirmPasswordValidator } from '@validators/index';

import { Users } from '@services/http/index';

@Component({
    selector: 'ui-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        RouterLink
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.sass'
})
export class RegisterComponent {
    constructor(
        public users: Users,
        public router: Router,
        private _snackBar: MatSnackBar
    ) {}

    formControl: FormGroup = new FormGroup(
        {
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.nullValidator]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
            password2: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
        },
        { validators: confirmPasswordValidator }
    );

    /**
     * Event handler que trata o evento de quando a senha ou confirmação é inserida
     * ou editada
     */
    passwordHandler() {
        let password2 = this.formControl.get('password2');
        if (!password2?.hasError('required') && !password2?.hasError('minlength')) {
            if (this.formControl.hasError('PasswordNoMatch')) {
                password2?.setErrors({ 'PasswordNoMatch': true });

            } else {
                password2?.setErrors(null);
            }
        }
    }

    /**
     * Pega os dados informados no formulário e os envia para serem salvos no
     * backend via requisição AJAX
     */
    register() {
        const params = { ...this.formControl.value }
        delete params.password2
        this.users.create('register', params).subscribe({
            next: (response: any) => {
                console.log(response)
                if (response.message) this._snackBar.open(response.message, 'Fechar', { duration: 5000 })
                this.router.navigateByUrl('/login')
            },
            error: (error: any) => {
                if (error.message) this._snackBar.open(error.message, 'Fechar', { duration: 5000 }) 
            }
        })
    }
}
