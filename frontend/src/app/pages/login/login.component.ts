import { Component } from '@angular/core';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css' ]
})

export class LoginComponent {
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
