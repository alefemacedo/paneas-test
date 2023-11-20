import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Rest {
    protected resource: string = ''
    constructor(protected http: HttpClient) {}

    getAll(url: String, config: Object = {}): Observable<Object> {
        return this.http.get(Rest.normalize(this.resource, url), config)
    }

    get(url: String, id: String|Number, config: Object = {}): Observable<Object> {
        return this.http.get(
            Rest.normalize(Rest.normalize(this.resource, url), id),
            config
        )
    }

    create(
        url: String,
        params: Object,
        config: Object = {}
    ): Observable<Object> {
        return this.http.post(Rest.normalize(this.resource, url), params, config)
    }

    update(
        url: String,
        id: String|Number,
        params: Object,
        config: Object = {}
    ): Observable<Object> {
        return this.http.put(
            Rest.normalize(Rest.normalize(this.resource, url), id),
            params,
            config
        )
    }

    /**
     * Recebe uma URL e um ID e remove o item
     *
     * @param url 
     * @param id 
     * @param config 
     * @returns 
     */
    destroy(url: String, id: String|Number, config: Object = {}): Observable<Object> {
        return this.http.delete(
            Rest.normalize(Rest.normalize(this.resource, url), id),
            config
        )
    }

    /**
     * Concatena dois endpoints
     *
     * @param {String|Number} start
     * @param {String|Number} end
     * @returns {String}
     */
    private static normalize(start: String|Number, end: String|Number) {
        return `${start}/${end}`.replace(/([^:]\/)\/+/g, '$1')
    }
}