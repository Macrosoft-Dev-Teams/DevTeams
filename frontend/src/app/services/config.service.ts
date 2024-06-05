import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../interfaces';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	public config: Observable<AppConfig>;

	constructor(http: HttpClient) {
		this.config = http.get<AppConfig>('http://localhost:3001/config/config.json').pipe(
			shareReplay(1),
			map((configFromServer) => {
				return {
					...configFromServer,
					baseApi: 'http://localhost:3001',
				};
			}),
		);
	}
}
