import { Component, Input } from '@angular/core';
import { Chat } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
	@Input() searchText?: Observable<string>;
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
	}
}
