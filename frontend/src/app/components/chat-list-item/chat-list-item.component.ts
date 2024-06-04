import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chat } from '@src/app/interfaces';
import { ApiService } from '@src/app/services/api.service';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.css'
})
export class ChatListItemComponent {
  @Input() chat: Partial<Chat> = {};
  @Output() dataEvent = new EventEmitter<number>();

  onClick() {
    const data = this.chat.chatId;
    this.dataEvent.emit(data);
  }
}
