import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { User } from '@src/app/interfaces';

@Component({
  selector: 'app-search-user-result',
  templateUrl: './search-user-result.component.html',
  styleUrl: './search-user-result.component.css'
})
export class SearchUserResultComponent {
  @Input() user: Partial<User> = {};
  @Output() dataEvent = new EventEmitter<number>();
  
  @HostListener("click") onClick(){
    const data = this.user.userId;
    this.dataEvent.emit(data);
  }
}
