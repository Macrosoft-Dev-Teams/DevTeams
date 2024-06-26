import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from './http.service';
import {
	WithMessageId,
	WithTeamId,
	Message,
	Chat,
	WithTeamInviteId,
	withUserId,
	TeamInvite,
	User,
	withChatId,
} from '../interfaces';

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

	inviteTeamMember(userEmail: string, teamId: number): Observable<number> {
		return this.httpService
			.post<WithTeamInviteId>(`teams/${teamId}/members`, {
				userEmail,
			})
			.pipe(map((response) => response.teamInviteId));
	}

	addUser() {
		return this.httpService
			.post<withUserId>('users/', {})
			.pipe(map((response) => response.userId));
	}

	getTeamInvite(inviteId: number): Observable<TeamInvite> {
		return this.httpService
			.get<TeamInvite>(`teams/invites/${inviteId}`);
	}

	updateInvite(inviteId: number, accepted: boolean): Observable<any> {
		return this.httpService.patch(`teams/invites/${inviteId}`, {
			accepted
		});
	}

	searchUserByEmail(userEmail: string): Observable<User> {
		return this.httpService.get<User>(`users/search/${userEmail}`);
	}

	createChat(otherUserId: number): Observable<Chat> {
		let chatId = this.httpService
			.post<withChatId>(`chats/`, {
				otherUserId,
			})
			.pipe(map((response) => response.chatId));
		return this.httpService.get<Chat>(`chats/${chatId}`); 
	}
}
