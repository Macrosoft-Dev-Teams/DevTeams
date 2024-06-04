import { Component } from '@angular/core';
import { ApiService } from '@src/app/services/api.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent {
  constructor(private apiService: ApiService) {}
}
