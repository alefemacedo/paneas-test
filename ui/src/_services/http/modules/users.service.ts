import { Injectable } from '@angular/core';
import { Rest } from '../rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Users extends Rest {
    constructor(http: HttpClient) {
        super(http)
        this.resource = 'users'
    }
}