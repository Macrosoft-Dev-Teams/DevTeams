import { Component, Input } from '@angular/core';
import { Chat } from '@src/app/interfaces';

@Component({
	selector: 'app-main-chat-details-view',
	templateUrl: './main-chat-details-view.component.html',
	styleUrl: './main-chat-details-view.component.css',
})
export class MainChatDetailsViewComponent {
	@Input() chat: Partial<Chat> = {};
}
