import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { Chat } from '@src/app/interfaces';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.css'
})
export class ChatListItemComponent {
  @Input() chat: Partial<Chat> = {};
  @Output() dataEvent = new EventEmitter<number>();
  
  @HostListener("click") onClick(){
    const data = this.chat.chatId;
    this.dataEvent.emit(data);
  }
  
  @HostBinding('class.selected') isSelected: boolean = false;

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
}
