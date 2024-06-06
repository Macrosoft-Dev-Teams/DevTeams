import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat, User } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';
import { BehaviorSubject, Observable, Subscription, distinct, filter, map, switchMap, timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
	@Input() searchText?: Observable<string>;
	@Input() newTeamIds?: Observable<number>;
	@Output() onOpenChat = new EventEmitter<Chat>();
	chats = new BehaviorSubject<Chat[]>([]);
	searchUser =  {} as User;
	subscription !: Subscription;
	searchString: string = '';

	constructor(private apiService: ApiService, private toastr: ToastrService) {}

	ngOnInit() {
		this.subscription = timer(0,5000).pipe(
			switchMap(() => this.apiService.listChats()),
			distinct(chats => JSON.stringify(chats)),
			map((chats) => { 
				if (this.searchString && /\S/.test(this.searchString)) { 
					return chats.filter(chat => chat.chatName.toLowerCase().includes(this.searchString))
				}
				else {
					return chats
				}
			})
		).subscribe({
			next: (chats) => this.chats.next(chats),
			error: (error) => {
				this.toastr.error(error, 'Error!');
			},
		});

		this.searchText?.subscribe({
			next: (text) => {
				this.searchString = text;
				this.apiService.listChats().pipe(
				distinct(chats => JSON.stringify(chats)),
				map((chats) => { 
					if (this.searchString && /\S/.test(this.searchString)) { 
						return chats.filter(chat => chat.chatName.toLowerCase().includes(this.searchString))
					}
					else {
						return chats
					}
				})).subscribe({
					next: (chats) => this.chats.next(chats),
					error: (error) => {
						this.toastr.error(error, 'Error!');
					},
				})
				if (this.searchString) {
					this.apiService.searchUserByEmail(text).subscribe({
						next: (user) => this.searchUser = user,
						error: (error: HttpErrorResponse) => {
							if (error.status == 400) {
								this.searchUser = {} as User;
							}	else {
								this.toastr.error(error.message, 'Error!');
							}		
						},
					})
				}	
				console.log(this.searchUser);
			},
		});

		this.newTeamIds
			?.pipe(
				switchMap(() => {
					return this.apiService.listChats();
				}),
			)
			.subscribe({
				next: (chats) => this.chats.next(chats),
				error: (error) => {
					alert(error);
				},
			});
	}

	onChatSelected(chat: Chat) {
		this.onOpenChat.emit(chat);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
