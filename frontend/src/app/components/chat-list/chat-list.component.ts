import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat, User } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';
import { BehaviorSubject, Observable, Subscription, distinct, filter, map, switchMap, timer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-chat-list',
	templateUrl: './chat-list.component.html',
	styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
	@Input() searchText?: Observable<string>;
	@Input() newTeamIds?: Observable<number>;
	@Output() onOpenChat = new EventEmitter<Chat>();
	@Output() onCreateChat = new EventEmitter<Chat>();
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
						next: (user) => {
							if (user.userId && user.displayName && user.userId >= 0) {
								this.searchUser = user;
							}	else {
								this.searchUser = {} as User;
							}
						},
						error: (error) => {
							this.searchUser = {} as User;
							this.toastr.error(error, 'Error!');	
						},
					})
				}	
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

	onSearchUserSelected(user: User) {
		//todo
		if (user.userId) {
			this.apiService.createChat(user.userId).subscribe({
					next: (chat) => {
						this.onCreateChat.emit(chat);
					},
					error: (error) => {
						this.toastr.error(error, 'Error!');
					},
				})
		}
		
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
