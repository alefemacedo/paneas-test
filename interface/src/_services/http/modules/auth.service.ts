import { Injectable } from '@angular/core';
import { Rest } from '../rest.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Auth extends Rest {
    constructor(http: HttpClient) {
        super(http)
        this.resource = 'api'
    }
}