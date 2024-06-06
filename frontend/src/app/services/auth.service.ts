import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
	getCurrentUser,
	signOut,
	fetchAuthSession,
	AuthTokens,
} from 'aws-amplify/auth';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private router: Router) {}

	async getLogInStatus(): Promise<boolean> {
		try {
			await fetchAuthSession({ forceRefresh: true });
			const user = await getCurrentUser();

			return user !== undefined;
		} catch (error) {
			return false;
		}
	}

	async handleAuthenticatedUser() {
		const isLoggedIn = await this.getLogInStatus();

		if (isLoggedIn) {
			this.router.navigate(['/home']);
		}
	}

	async getCurrentSession(): Promise<AuthTokens | undefined> {
		return (await fetchAuthSession()).tokens;
	}

	async getCurrentUserFullName(): Promise<string | undefined> {
		let cognitoToken = (await fetchAuthSession()).tokens;

		return cognitoToken?.idToken?.payload['name']?.toString();
	}

	async getAccessToken(): Promise<string | undefined> {
		let cognitoToken = (await fetchAuthSession()).tokens;

		return cognitoToken?.accessToken?.payload.toString();
	}

	async getIdToken(): Promise<string | undefined> {
		let cognitoToken = (await fetchAuthSession()).tokens;

		return cognitoToken?.idToken?.toString();
	}

	signOut() {
		signOut();
	}
}
