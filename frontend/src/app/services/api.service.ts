import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from './http.service';
import { WithMessageId } from '../interfaces';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	constructor(private httpService: HttpService) {}

	sendMessage(message: string, chatId: number): Observable<number> {
		return this.httpService
			.post<WithMessageId>(`chats/${chatId}/messages/text`, {
				messageText: message,
			})
			.pipe(map((response) => response.messageId));
	}
}
