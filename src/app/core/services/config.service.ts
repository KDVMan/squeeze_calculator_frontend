import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: any;

    constructor(private http: HttpClient) {
    }

    public load(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.get('/assets/config.json').subscribe({
                next: (response: any) => {
                    this.config = response;
                    resolve(true);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    }

    public get(name: string): any {
        let value = this.config;

        for (const key of name.split('.')) {
            if (value && value[key]) value = value[key];
            else return '';
        }

        return value;
    }
}
