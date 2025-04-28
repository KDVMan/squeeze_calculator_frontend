import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class TranslationService {
	private dictionary: object;

	constructor(@Inject(LOCALE_ID) private locale: string,
				private readonly http: HttpClient) {
	}

	public load(): Promise<boolean> {
		return new Promise((resolve) => {
			this.http.get(`/assets/i18n/${this.locale}.json`).pipe(
				map(res => res),
				catchError(error => {
					resolve(true);
					throw new Error(error);
				})
			).subscribe((dictionary: any) => {
				this.dictionary = dictionary;
				resolve(true);
			});
		});
	}

	public getMessage(module: string, key: string): string {
		const errorMessage = `модуль '${module}' или ключ '${key}' не найден`;

		if (this.dictionary[module]) return this.dictionary[module][key] ? this.dictionary[module][key] : errorMessage;

		return errorMessage;
	}
}
