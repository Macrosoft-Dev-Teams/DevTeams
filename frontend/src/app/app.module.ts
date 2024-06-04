import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { RouterOutlet } from '@angular/router';

import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';

import { environment } from '@src/environments/environment';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { CreateTeamComponent } from './components/create-team/create-team.component';
import { provideHttpClient } from '@angular/common/http';

Amplify.configure({
	Auth: {
		Cognito: {
			userPoolId: environment.userPoolId,
			userPoolClientId: environment.userPoolClientId,
		},
	},
});

@NgModule({
	declarations: [CreateTeamComponent, ChatInputComponent, AppComponent, LoginComponent],
	imports: [
		RouterOutlet,
		BrowserModule,
		AppRoutingModule,
		AmplifyAuthenticatorModule,
		ReactiveFormsModule,
	],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent],
})
export class AppModule {}
