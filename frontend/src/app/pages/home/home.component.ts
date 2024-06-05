import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Chat } from '@src/app/interfaces';
import { AuthService } from '@src/app/services/auth.service';
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

	constructor(private router: Router, private authService: AuthService) {}

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

	signOut() {
		this.authService.signOut();
		this.router.navigate(['/'])
	}
}
