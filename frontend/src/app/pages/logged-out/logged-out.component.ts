import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logged-out',
  templateUrl: './logged-out.component.html',
  styleUrl: './logged-out.component.css'
})
export class LoggedOutComponent {

  constructor(private router: Router) {}

  signIn(){

    this.router.navigate(['/login']);
  }
}
