import { Component } from '@angular/core';
import { Chat } from '@src/app/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrl: './home.component.css',
})
export class HomeComponent {
	newTeamIds = new BehaviorSubject(-1);
	creatingNewTeam = false;
	currentChat?: Chat;

	get newTeamIdsObservable(): Observable<number> {
		return this.newTeamIds;
	}

	onCreateNewTeam() {
		this.creatingNewTeam = true;
	}

	onCreateTeamCancelled() {
		this.creatingNewTeam = false;
	}

	onTeamCreated(teamId: any) {
		this.newTeamIds.next(teamId);
		this.creatingNewTeam = false;
	}

	onChatSelected(chat: any) {
		this.creatingNewTeam = false;
		this.currentChat = chat;    
	}
}
