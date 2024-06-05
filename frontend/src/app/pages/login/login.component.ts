import { Component } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AuthService } from '@src/app/services/auth.service';

import { Hub } from 'aws-amplify/utils';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	constructor(
		public authenticator: AuthenticatorService,
		private authService: AuthService,
	) {
		Hub.listen('auth', (data) => {
			if (data.payload.event === 'signedIn') {
				this.authService.handleAuthenticatedUser();
			}
		});
	}

	ngOnInit() {
    this.authService.handleAuthenticatedUser();
  }

	formFields = {
		signUp: {
			name: {
				order: 1,
			},
			email: {
				order: 2,
			},
			password: {
				order: 5,
			},
			confirm_password: {
				order: 6,
			},
		},
	};
}
