import { EventEmitter, Output } from '@angular/core';
import { Component } from '@angular/core';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { AuthService } from '@src/app/services/auth.service';

import { ToastrService } from 'ngx-toastr';

import { Hub } from 'aws-amplify/utils';
import { ApiService } from '@src/app/services/api.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent {
	@Output() onUserAdd = new EventEmitter<number>();

	constructor(
		public authenticator: AuthenticatorService,
		private authService: AuthService,
		private apiService: ApiService,
		private toastr: ToastrService,
	) {
		Hub.listen('auth', (data) => {
			if (data.payload.event === 'signedIn') {
				this.authService.handleAuthenticatedUser();
				this.addUser();
			}
		});
	}

	ngOnInit() {
		this.authService.handleAuthenticatedUser();
	}

	addUser() {
		this.apiService.addUser().subscribe({
			next: (userId) => this.onUserAdd.emit(userId),
			error: (error) => {
				this.toastr.error(error, 'Error!');
			},
		});
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
