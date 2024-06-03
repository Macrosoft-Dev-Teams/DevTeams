import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-chat-input',
	templateUrl: './chat-input.component.html',
	styleUrl: './chat-input.component.css',
})
export class ChatInputComponent {
  @Input() chatId = -1;
	newMessage = new FormControl('');

	constructor(private apiService: ApiService) {}

	onKeyboardEnterKey() {
		if (this.newMessage.value?.trim().length === 0) {
			alert('Please provide a message to send.');
		} else {
			this.apiService.sendMessage(this.newMessage.value!, this.chatId).subscribe({
				next: () => {},
				error: (error) => {
					alert(error);
				},
			});
		}
	}
}
