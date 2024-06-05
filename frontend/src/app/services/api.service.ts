import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from './http.service';
import { WithMessageId, WithTeamId, Message, Chat } from '../interfaces';

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

	createTeam(name: string): Observable<number> {
		return this.httpService
			.post<WithTeamId>(`teams/`, {
				teamName: name,
			})
			.pipe(map((response) => response.teamId));
	}

	listMessages(chatId: number): Observable<Message[]> {
		return this.httpService.get<Message[]>(`chats/${chatId}/messages`);
	}	

	listChats(): Observable<Chat[]> {
		return this.httpService.get<Chat[]>(`chats/`);
	}	
}
