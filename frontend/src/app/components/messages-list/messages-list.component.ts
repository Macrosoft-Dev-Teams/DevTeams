import { Component, Input } from '@angular/core';
import { Message } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';
import { BehaviorSubject, Subscription, distinct, map, switchMap, timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-messages-list',
	templateUrl: './messages-list.component.html',
	styleUrl: './messages-list.component.css',
})
export class MessagesListComponent {
	@Input() chatId = -1;
	messages = new BehaviorSubject<Message[]>([]);
	subscription!: Subscription;

	constructor(
		private apiService: ApiService,
		private toastr: ToastrService,
	) {}

	ngOnInit() {
		this.subscription = timer(0, 5000)
			.pipe(
				switchMap(() =>
					this.apiService.listMessages(this.chatId).pipe(
						distinct(messages => JSON.stringify(messages)),
						map((messages) =>
							messages.map<Message>((message) => {
								return {
									...message,
									displayName: message.isCurrentUser
										? 'You'
										: message.displayName,
								};
							}),
						),
					),
				),
			)
			.subscribe({
				next: (messages) => this.messages.next(messages),
				error: (error) => {
					this.toastr.error(error, 'Error!');
				},
			});
	}

	onMessageSent(message: Message) {
		this.messages.next([...this.messages.value, message]);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	isInviteMessage(message: Message) {
		if (message.messageText) {
			return message.messageText.indexOf('?teaminvite=') !== -1;
		} else {
			return false;
		}
	}

	getTeamInviteId(messageText: string): number | undefined {
		const matches = RegExp(/\d+/).exec(messageText);
		return matches ? parseInt(matches[0]) : undefined;
	} 
}
