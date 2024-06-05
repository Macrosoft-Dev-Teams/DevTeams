import { Component, Input } from '@angular/core';
import { Message } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';
import { BehaviorSubject, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-messages-list',
	templateUrl: './messages-list.component.html',
	styleUrl: './messages-list.component.css',
})
export class MessagesListComponent {
	@Input() chatId = -1;
	messages = new BehaviorSubject<Message[]>([]);

	constructor(private apiService: ApiService, private toastr: ToastrService) {}

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
					this.toastr.error('Error!', error);
				},
			});
	}

	onMessageSent(message: Message) {
		this.messages.next([...this.messages.value, message]);
	}
}
