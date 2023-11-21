import { Injectable } from '@angular/core';
import { Rest } from '../rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Tasks extends Rest {
    constructor(http: HttpClient) {
        super(http);
        this.resource = 'users/tasks';
    }
}