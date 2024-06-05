import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
	@Input() searchText?: Observable<string>;
	@Input() newTeamIds?: Observable<number>;
	@Output() onOpenChat = new EventEmitter<Chat>();
	chats = new BehaviorSubject<Chat[]>([]);

	constructor(private apiService: ApiService) {}

	ngOnInit() {
		this.apiService.listChats().subscribe({
			next: (chats) => this.chats.next(chats),
			error: (error) => {
				alert(error);
			},
		});

		this.searchText?.subscribe({
			next: (text) => console.log(text),
		});

		this.newTeamIds
			?.pipe(
				switchMap(() => {
					return this.apiService.listChats();
				}),
			)
			.subscribe({
				next: (chats) => this.chats.next(chats),
				error: (error) => {
					alert(error);
				},
			});
	}

	onChatSelected(chat: Chat) {
		this.onOpenChat.emit(chat);
	}
}
