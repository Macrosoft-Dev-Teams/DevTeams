import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Message } from '@src/app/interfaces';

@Component({
	selector: 'app-chat-input',
	templateUrl: './chat-input.component.html',
	styleUrl: './chat-input.component.css',
})
export class ChatInputComponent {
  @Input() chatId = -1;
	@Output() onMessageSent = new EventEmitter<Message>();
	newMessage = new FormControl('');

	constructor(private apiService: ApiService) {}

	onKeyboardEnterKey() {
		if (this.newMessage.value?.trim().length === 0) {
			alert('Please provide a message to send.');
		} else {
			this.apiService.sendMessage(this.newMessage.value!, this.chatId).subscribe({
				next: (messageId) => {
					const currentIsoTime = new Date().toISOString();
					this.onMessageSent.emit({
						displayName: "You",
						isCurrentUser: true,
						userIsDeleted: false,
						messageText: this.newMessage.value!,
						savedAt: currentIsoTime,
						sentAt: currentIsoTime,
						messageId
					});

					this.newMessage.setValue('');
				},
				error: (error) => {
					alert(error);
				},
			});
		}
	}
}
