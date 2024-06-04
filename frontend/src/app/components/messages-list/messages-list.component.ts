import { Component, Input } from '@angular/core';
import { Message } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';
import { BehaviorSubject, map } from 'rxjs';

@Component({
	selector: 'app-messages-list',
	templateUrl: './messages-list.component.html',
	styleUrl: './messages-list.component.css',
})
export class MessagesListComponent {
	@Input() chatId = -1;
	messages = new BehaviorSubject<Message[]>([]);

	constructor(private apiService: ApiService) {}

	ngOnInit() {
		this.apiService
			.listMessages(this.chatId)
			.pipe(
				map((messages) =>
					messages.map<Message>((message) => {
						return {
							...message,
							displayName: message.isCurrentUser ? 'You' : message.displayName,
						};
					}),
				),
			)
			.subscribe({
				next: (messages) => this.messages.next(messages),
				error: (error) => {
					alert(error);
				},
			});
	}

	onMessageSent(message: Message) {
		this.messages.next([...this.messages.value, message]);
	}
}
