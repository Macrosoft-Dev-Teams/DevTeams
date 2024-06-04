import { Component, Input } from '@angular/core';
import { Chat } from '@src/app/interfaces';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrl: './chat-header.component.css'
})
export class ChatHeaderComponent {
  @Input() chat: Partial<Chat> = {};
}
