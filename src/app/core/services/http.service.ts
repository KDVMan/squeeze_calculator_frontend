import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class HttpService {
	constructor(private http: HttpClient) {
	}

	public get<OUT>(path: string, useJson: boolean = true): Observable<OUT> {
		return this.http.get(path, this.addOptions(useJson)).pipe(
			map(res => res.body as OUT)
		);
	}

	public post<IN, OUT>(path: string, body: IN, useJson: boolean = true): Observable<OUT> {
		return this.http.post(path, body, this.addOptions(useJson)).pipe(
			map(res => {
				return res.body as OUT;
			})
		);
	}

	private addOptions(useJson: boolean = true): { headers: HttpHeaders, observe: 'response' } {
		let headers = new HttpHeaders();
		if (useJson) headers = headers.append('Content-type', 'application/json');

		return {
			headers: headers,
			observe: 'response' as 'response'
		};
	}
}
