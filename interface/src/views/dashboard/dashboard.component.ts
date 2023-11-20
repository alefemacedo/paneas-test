import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router, RouterLink } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';

import { TaskFormDialog, TaskData } from '@components/task-form/task-form.component';

import { Tasks } from '@services/http/index';
import { Storage } from '@services/storage.service'

@Component({
    selector: 'ui-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatTableModule,
        MatButtonModule,
        MatMenuModule,
        RouterLink,
        MatListModule
    ],
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit {
    constructor(
        public dialog: MatDialog,
        public tasks: Tasks,
        private _snackBar: MatSnackBar,
        public storage: Storage,
        public router: Router
    ) {}

    ngOnInit() {
        this.loadData()
    }

    showFiller = false

    columnsToDisplay = ['id', 'title', 'due_date', 'responsible.first_name'];
    columnsLabels: any = {
        id: 'ID',
        title: 'Título',
        due_date: 'Data limite',
        'responsible.first_name': 'Responsável'
    }
    columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
    expandedElement: TaskData | null = null;
    dataSource: TaskData[] = [];

    /**
     * Recebe um objeto e um caminho até sua propriedade e retorna o valor desta
     *
     * @param obj Objeto a ter a propriedade acessada
     * @param path Caminho da propriedade
     * @returns 
     */
    getNestedProperty(obj: any, path: string): any {
        const keys = path.split('.');
        let currentObj = obj;
    
        for (const key of keys) {
            if (currentObj && typeof currentObj === 'object' && key in currentObj) {
                currentObj = currentObj[key];
            } else {
                return undefined; // Property not found
            }
        }
    
        return currentObj;
    }

    /**
     * Realiza a requisição AJAX que busca todas as tarefas cadastradas no sistema
     */
    loadData() {
        this.tasks.getAll('list').subscribe({
            next: (response: any) => {
                this.dataSource = response.data
            },
            error: (error: any) => {
                console.log(error)
                if (error.message) this._snackBar.open(error.message, 'Fechar', { duration: 5000 })
            }
        })
    }

    /**
     * Abre o modal responsável pelo cadastro e edição das tarefas
     */
    addTask(): void {
        const dialogRef = this.dialog.open(TaskFormDialog, { data: null, width: '100%' });

        dialogRef.afterClosed().subscribe(() => {
            this.loadData()
        });
    }

    /**
     * Realiza a requisição AJAX que busca os dados de uma tarefa, de acordo com seu
     * ID, para serem editados no modal
     */
    editTask(task: TaskData) {
        const dialogRef = this.dialog.open(TaskFormDialog, { data: { ...task }, width: '100%' });

        dialogRef.afterClosed().subscribe(() => {
            this.loadData()
        });
    }

    /**
     * Realiza a requisição AJAX que remove uma tarefa de acordo com seu ID
     */
    deleteTask(id: String|Number) {
        this.tasks.destroy('delete', id).subscribe({
            next: (response: any) => {
                if (response.msg) this._snackBar.open(response.msg, 'Fechar', { duration: 5000 })
                this.loadData()
            },
            error: (error: any) => {
                console.log(error)
                if (error.message) this._snackBar.open(error.message, 'Fechar', { duration: 5000 })
            }
        })
    }

    /**
     * Desloga o usuário dos sistema e redireciona para a tela de login
     */
    logout() {
        this.storage.clear()
        this.router.navigateByUrl('/login')
    }
}
