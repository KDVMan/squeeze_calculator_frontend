import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DictionaryService {
    private dictionary: any;

    constructor(private readonly http: HttpClient) {
    }

    public load(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.http.get('/assets/dictionary/dictionary.json').subscribe({
                next: (response: any) => {
                    this.dictionary = response;
                    resolve(true);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    }

    public get(key: string): string {
        return this.dictionary[key] ? this.dictionary[key] : this.dictionary['default'];
    }
}
