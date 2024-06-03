import { Injectable } from '@angular/core';

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
	constructor() {}

	async getLogInStatus(): Promise<boolean> {
		try {
			await fetchAuthSession({ forceRefresh: true });
			await getCurrentUser();

			return true;
		} catch (error) {
			// console.error('Error checking login status:', error);

			return false;
		}
	}

	async getCurrentSession(): Promise<AuthTokens | undefined> {
		return (await fetchAuthSession()).tokens;
	}

	async getCurrentUserFullName(): Promise<string | undefined> {
		let cognitoToken = (await fetchAuthSession()).tokens;

		return cognitoToken?.idToken?.payload['name']?.toString();
	}

	signOut() {
		signOut();
	}
}
