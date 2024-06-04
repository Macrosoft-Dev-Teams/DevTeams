import { Component } from '@angular/core';
import { Chat } from '@src/app/interfaces';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent {
	creatingNewTeam = false;
	currentChat?: Chat;

	onCreateNewTeam() {
		this.creatingNewTeam = true;
	}

	onCreateTeamCancelled() {
		this.creatingNewTeam = false;
	}

	onTeamCreated() {
		this.creatingNewTeam = false;
	}

	onChatSelected(chat: any) {
		this.creatingNewTeam = false;
		this.currentChat = chat;    
	}
}
