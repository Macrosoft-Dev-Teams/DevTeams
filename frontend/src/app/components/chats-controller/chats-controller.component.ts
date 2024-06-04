import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-chats-controller',
  templateUrl: './chats-controller.component.html',
  styleUrl: './chats-controller.component.css'
})
export class ChatsControllerComponent {
  @Output() onCreateNewTeam = new EventEmitter();
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
}
