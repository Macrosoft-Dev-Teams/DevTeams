import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
	providedIn: 'root',
})
export class HttpService {
	constructor(
		private http: HttpClient,
		private configService: ConfigService,
	) {}

	get<T>(path: string): Observable<T> {
		return this.makeEndpoint(path).pipe(
			switchMap((endpoint) => {
				return this.http.get<T>(endpoint, { headers: this.headers });
			}),
		);
	}

	post<T>(path: string, body: Object): Observable<T> {
		return this.makeEndpoint(path).pipe(
			switchMap((endpoint) => {
				return this.http.post<T>(endpoint, body, { headers: this.headers });
			}),
		);
	}

	patch<T>(path: string, body: Object): Observable<T> {
		return this.makeEndpoint(path).pipe(
			switchMap((endpoint) => {
				return this.http.patch<T>(endpoint, body, { headers: this.headers });
			}),
		);
	}

	put<T>(path: string, body: Object): Observable<T> {
		return this.makeEndpoint(path).pipe(
			switchMap((endpoint) => {
				return this.http.put<T>(endpoint, body, { headers: this.headers });
			}),
		);
	}

	delete<T>(path: string): Observable<T> {
		return this.makeEndpoint(path).pipe(
			switchMap((endpoint) => {
				return this.http.delete<T>(endpoint, { headers: this.headers });
			}),
		);
	}

	private get headers() {
		return {
			'Content-Type': 'application/json',
      // TODO: Inject user token if available
      'Authorization': '1'
		};
	}

	private makeEndpoint(path: string): Observable<string> {
		return this.configService.config.pipe(
			map((config) => {
				return `${config.baseApi}/${path}`;
			}),
		);
	}
}
