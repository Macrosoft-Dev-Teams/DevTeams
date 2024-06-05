import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat } from '@src/app/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-chats-controller',
  templateUrl: './chats-controller.component.html',
  styleUrl: './chats-controller.component.css'
})
export class ChatsControllerComponent {
  @Input() newTeamIds?: Observable<number>;
  @Output() onCreateNewTeam = new EventEmitter();
  @Output() onOpenChat = new EventEmitter<Chat>();
  private searchText = new BehaviorSubject('');

  get searchTextObservable(): Observable<string> {
    return this.searchText;
  };

  onSearchChanged(text: any) {
    this.searchText.next(text);
  }

  handleCreateNewTeam() {
    this.onCreateNewTeam.emit();
  }

  onChatSelected(chat: any) {
    this.onOpenChat.emit(chat);
  }
}
