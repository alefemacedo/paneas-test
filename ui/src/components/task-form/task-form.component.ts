import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import moment from 'moment';

import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
    FormControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Tasks, Users } from '@services/http/index';

export interface TaskData {
    id: String|Number;
    responsible_id: String|Number;
    responsible: any;
    title: string;
    description: string;
    due_date: string;
}

@Component({
    selector: 'ui-task-form-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule
    ],
    templateUrl: './task-form.component.html',
    styleUrl: './task-form.component.sass'
})
export class TaskFormDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<TaskFormDialog>,
        @Inject(MAT_DIALOG_DATA) public data: TaskData,
        public tasks: Tasks,
        public users: Users,
        private _snackBar: MatSnackBar
    ) {}

    formControl: FormGroup = new FormGroup(
        {
            title: new FormControl('', [Validators.required, Validators.minLength(5)]),
            description: new FormControl('', [Validators.required, Validators.minLength(15)]),
            due_date: new FormControl('', [Validators.required]),
            responsible_id: new FormControl(null, [Validators.required])
        }
    );

    userOptions: { label: String|Number, value: String }[] = []

    ngOnInit() {
        this.loadForm()
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    /**
     * Carrega os dados necessários para montar o formulário
     */
    loadForm() {
        this.users.getAll('list').subscribe({
            next: (response: any) => {
                console.log(response)
                this.userOptions = Object.values(response.data).map((user: any) => {
                    return {
                        value: user.id,
                        label: user.first_name
                    }
                })

                if (this.data) this.formControl.patchValue(this.data)
            },
            error: (error: any) => {
                if (error.msg) this._snackBar.open(error.message, 'Fechar', { duration: 5000 }) 
            }
        })
    }

    /**
     * Realiza uma requisição para criar uma nova tarefa com os dados informados no
     * formulário
     */
    save(): void {
        let params = {
            ...this.formControl.value,
            due_date: moment(this.formControl.value['due_date']).format('YYYY-MM-DD')
        }
        this.tasks.create('create', params).subscribe({
            next: (response: any) => {
                console.log(response)
                if (response.msg) this._snackBar.open(response.msg, 'Fechar', { duration: 5000 })
                this.formControl.reset()
                this.dialogRef.close();
            },
            error: (error: any) => {
                if (error.msg) this._snackBar.open(error.message, 'Fechar', { duration: 5000 }) 
            }
        })
    }

    /**
     * Recebe o identificador de uma tarefa e envia os dados do formulário
     * para atualizá-la
     *
     * @param id Identificador da tarefa a ser atualizada
     */
    update(id: String|Number): void {
        let params = {
            ...this.formControl.value,
            due_date: moment(this.formControl.value['due_date']).format('YYYY-MM-DD')
        }
        this.tasks.update('update', id, params).subscribe({
            next: (response: any) => {
                console.log(response)
                if (response.msg) this._snackBar.open(response.msg, 'Fechar', { duration: 5000 });
                this.formControl.reset();
                this.dialogRef.close();
            },
            error: (error: any) => {
                if (error.msg) this._snackBar.open(error.message, 'Fechar', { duration: 5000 });
            }
        })
    }

    /**
     * Event handler que trata o evento de quando uma solicitação para submitar o
     * formulário é executada, assim decide se cria ou atualiza uma tarefa
     */
    submit() {
        if (this.data?.id) {
            this.update(this.data.id)

        } else {
            this.save()
        }
    }
}