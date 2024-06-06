import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/services/auth.service';

@Component({
  selector: 'app-logged-out',
  templateUrl: './logged-out.component.html',
  styleUrl: './logged-out.component.css'
})
export class LoggedOutComponent {

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.handleAuthenticatedUser();
  }

  signIn(){

    this.router.navigate(['/login']);
  }
}
