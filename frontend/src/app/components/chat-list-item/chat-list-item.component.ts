import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '@src/app/services/api.service';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.css'
})
export class ChatListItemComponent {
  @Input() id = -1;
  @Input() name = '';
  @Input() lastMessage = '';
  @Output() dataEvent = new EventEmitter<string>();

  constructor(private apiService: ApiService) {}

  onClick() {
    const data = this.id.toString();
    this.dataEvent.emit(data);
  }
}
